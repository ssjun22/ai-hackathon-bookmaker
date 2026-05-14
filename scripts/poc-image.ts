import { config as loadDotenv } from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';

// .env.local 우선, 없으면 .env로 폴백 (Next.js 컨벤션과 일치)
loadDotenv({ path: path.resolve(process.cwd(), '.env.local') });
loadDotenv({ path: path.resolve(process.cwd(), '.env') });

// 키 변수명 호환: GOOGLE_API_KEY 도 GOOGLE_GENERATIVE_AI_API_KEY 와 동일하게 인식
if (process.env.GOOGLE_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_API_KEY;
}

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { CONVERSATION } from './conversation';

// ---------- 사용자 편집 영역 ----------
// 이 PROMPTS 객체의 텍스트를 자유롭게 수정해 다양한 이미지를 시도해보세요.

// Google AI Studio 직접 호출 (Vercel AI Gateway 우회, 무료 티어 사용)
const MODEL = google('gemini-3.1-flash-image-preview');

// 해상도·비율 — 비용 최소화를 위해 512p (1K 대비 약 50% 절감)
// 옵션: '512p' | '1K' | '2K' | '4K'  (Nano Banana 2)
const IMAGE_SIZE: '512p' | '1K' | '2K' | '4K' = '512p';
const ASPECT_RATIO = '1:1';

const PROMPTS = {
  systemTone: '한국 전래동화 그림책 스타일. 따뜻한 수채화 느낌. 부드러운 색감. 아이가 보기 편한 일러스트. 폭력/공포 없음.',

  reference: `${'한국 전래동화 그림책 스타일'} ... 둥근 인상의 농부 아저씨, 따뜻한 미소, 한복 작업복, 정면 클로즈업, 단순한 시골 배경, 핑크빛 따뜻한 톤.`,
};

// ---------- 책 정적 데이터 ----------

const BOOK = {
  id: 'rabbit',
  title: '송아지와 바꾼 무',
  author: '전래동화',
  summary: '마음씨 좋은 농부가 커다란 무를 원님께 정성껏 선물하자 원님은 기뻐하며 말 한 필을 내려줍니다. 이 소식을 들은 욕심쟁이 부자가 비단을 갖다 바쳤더니 원님은 "마침 좋은 것이 생겼소"라며 농부에게 받은 무를 돌려줍니다. 진심 어린 마음이 가장 값진 선물임을 깨닫게 해 주는 이야기',
};

// ---------- 환경 검증 ----------

function requireEnv(): void {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error('[poc-image] GOOGLE_GENERATIVE_AI_API_KEY 또는 GOOGLE_API_KEY 환경변수가 없습니다.');
    console.error('  1) https://aistudio.google.com 에서 API key 발급 (무료, 카드 등록 불필요)');
    console.error('  2) 프로젝트 루트 .env.local 또는 .env 에 다음 중 한 줄 추가:');
    console.error('     GOOGLE_GENERATIVE_AI_API_KEY=<키>   (AI SDK 표준)');
    console.error('     GOOGLE_API_KEY=<키>                  (자동으로 위 이름에 매핑)');
    console.error('  3) 다시 실행: pnpm tsx scripts/poc-image.ts');
    process.exit(1);
  }
}

// ---------- 장면 로딩 (tmp/scenes.json from poc-text.ts) ----------

type Scene = { idx: number; title: string; body: string };

function loadScenes(): Scene[] {
  const scenesPath = path.resolve(process.cwd(), 'tmp', 'scenes.json');
  if (!fs.existsSync(scenesPath)) {
    console.error('[poc-image] tmp/scenes.json 파일이 없습니다.');
    console.error('  먼저 텍스트 생성 스크립트를 실행하세요:');
    console.error('    pnpm tsx scripts/poc-text.ts');
    process.exit(1);
  }
  const raw = fs.readFileSync(scenesPath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error('tmp/scenes.json 루트가 배열이 아닙니다.');
  }
  return parsed.map((item, i) => {
    if (typeof item?.idx !== 'number' || typeof item?.title !== 'string' || typeof item?.body !== 'string') {
      throw new Error(`tmp/scenes.json 항목 ${i} 스키마 불일치: ${JSON.stringify(item)}`);
    }
    return { idx: item.idx, title: item.title, body: item.body };
  });
}

// ---------- reference 이미지 생성 ----------

async function buildReferencePrompt(): Promise<string> {
  const userVoices = CONVERSATION
    .filter((t) => t.role === 'user')
    .map((t) => `- ${t.text}`)
    .join('\n');
  return [
    PROMPTS.systemTone,
    `책 제목: ${BOOK.title} (${BOOK.author})`,
    `독자 요청 요약:\n${userVoices}`,
    '',
    PROMPTS.reference,
  ].join('\n');
}

async function generateReference(outDir: string): Promise<string> {
  console.log(`[poc-image] reference 이미지 생성 중... (책: ${BOOK.title}, 대화 턴 수: ${CONVERSATION.length})`);
  const prompt = await buildReferencePrompt();
  const result = await generateText({
    model: MODEL,
    prompt,
    maxRetries: 0,
    providerOptions: {
      google: {
        responseModalities: ['IMAGE'],
        imageConfig: { imageSize: IMAGE_SIZE, aspectRatio: ASPECT_RATIO },
      },
    },
  });
  const imageFile = result.files.find((f) => f.mediaType?.startsWith('image/'));
  if (!imageFile) {
    throw new Error('reference 응답에 이미지가 없습니다. PROMPTS.reference 수정 또는 모델 응답 확인 필요.');
  }
  const filePath = path.join(outDir, '01-reference.png');
  fs.writeFileSync(filePath, imageFile.uint8Array);
  console.log(`  ✓ 저장: ${filePath}`);
  return filePath;
}

// ---------- 장면 이미지 생성 ----------

async function generateScene(
  outDir: string,
  refPath: string,
  scene: Scene
): Promise<string> {
  console.log(`[poc-image] 장면 ${scene.idx} (${scene.title}) 생성 중...`);
  const refBuffer = fs.readFileSync(refPath);
  const sceneText = `장면 ${scene.idx} — ${scene.title}: ${scene.body}`;
  const result = await generateText({
    model: MODEL,
    maxRetries: 0,
    providerOptions: {
      google: {
        responseModalities: ['IMAGE'],
        imageConfig: { imageSize: IMAGE_SIZE, aspectRatio: ASPECT_RATIO },
      },
    },
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: `${PROMPTS.systemTone}\n\n위 참조 이미지의 캐릭터 외형과 그림체를 그대로 유지하면서 다음 장면을 그려줘:\n${sceneText}` },
          { type: 'image', image: refBuffer },
        ],
      },
    ],
  });
  const imageFile = result.files.find((f) => f.mediaType?.startsWith('image/'));
  if (!imageFile) {
    throw new Error(`장면 ${scene.idx} 응답에 이미지가 없습니다. tmp/scenes.json body 수정 또는 reference 입력 지원 확인 필요.`);
  }
  const outName = `${String(scene.idx + 1).padStart(2, '0')}-scene-${scene.idx}.png`;
  const filePath = path.join(outDir, outName);
  fs.writeFileSync(filePath, imageFile.uint8Array);
  console.log(`  ✓ 저장: ${filePath}`);
  return filePath;
}

// ---------- main ----------

async function main() {
  requireEnv();
  const outDir = path.resolve(process.cwd(), 'tmp');
  fs.mkdirSync(outDir, { recursive: true });

  const scenes = loadScenes();
  console.log(`[poc-image] tmp/scenes.json 로드 — 장면 ${scenes.length}개`);

  const refPath = await generateReference(outDir);
  const scenePaths: string[] = [];
  for (const scene of scenes) {
    scenePaths.push(await generateScene(outDir, refPath, scene));
  }

  console.log(`\n[poc-image] 총 ${1 + scenePaths.length}장 생성 완료. tmp/ 폴더에서 확인하세요:`);
  console.log(`  - ${refPath}`);
  scenePaths.forEach((p) => console.log(`  - ${p}`));
  console.log('\n장면 본문은 scripts/poc-text.ts 재실행으로, 그림체/캐릭터는 scripts/poc-image.ts 상단 PROMPTS 수정으로 바꿀 수 있습니다.');
}

main().catch((err) => {
  console.error('[poc-image] 실패:', err);
  process.exit(1);
});
