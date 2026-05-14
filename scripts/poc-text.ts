import { config as loadDotenv } from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';

loadDotenv({ path: path.resolve(process.cwd(), '.env.local') });
loadDotenv({ path: path.resolve(process.cwd(), '.env') });

if (process.env.GOOGLE_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_API_KEY;
}

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { CONVERSATION } from './conversation';

// ---------- 사용자 편집 영역 ----------

const MODEL = google('gemini-3.1-flash-lite-preview');

const SYSTEM_PROMPT = `당신은 한국 전래동화를 아이의 취향에 맞춰 새로 쓰는 작가입니다.

규칙:
- 한국어로 작성
- 각 장면 본문은 1-2문장, 40-60자 정도의 짧고 운율감 있는 동화책 톤
- 따뜻하고 평화로운 분위기 유지 (폭력/공포/자극 없음)
- 아이의 요청(보라색 호박, 따뜻한 시골 풍경 등 사용자 발화에 있는 내용)을 자연스럽게 반영
- 장면 사이 흐름이 자연스럽게 이어져야 함
- 마지막 장면은 동화의 결말(여운/교훈)로 마무리

출력은 반드시 JSON 배열이어야 하며, 각 항목은 { "idx": number, "title": string, "body": string } 형식입니다.
title은 8자 이내의 장면 제목, body는 본문입니다.
JSON 외 다른 텍스트는 출력하지 마세요. 코드블록 마크다운(\`\`\`)도 사용하지 마세요.`;

const SCENE_FRAMES = [
  { idx: 1, frame: '착한 농부가 커다란 무를 사또에게 선물하자, 사또가 보답으로 송아지를 줌.' },
  { idx: 2, frame: '욕심쟁이 농부가 송아지를 사또에게 선물하자, 사또가 보답으로 커다란 무를 줌.' },
  { idx: 3, frame: '(원문 결말 이후 자유 내용 — 다음 장면과 자연스럽게 이어지도록 작성)' },
  { idx: 4, frame: '(원문 결말 이후 자유 내용 — 동화의 결말로 자연스럽게 마무리)' },
];

// ---------- 책 정적 데이터 ----------

const BOOK = {
  id: 'rabbit',
  title: '송아지와 바꾼 무',
  author: '전래동화',
  summary: '마음씨 좋은 농부가 커다란 무를 원님께 정성껏 선물하자 원님은 기뻐하며 말 한 필을 내려줍니다. 이 소식을 들은 욕심쟁이 부자가 비단을 갖다 바쳤더니 원님은 "마침 좋은 것이 생겼소"라며 농부에게 받은 무를 돌려줍니다. 진심 어린 마음이 가장 값진 선물임을 깨닫게 해 주는 이야기',
};

// ---------- 출력 타입 ----------

type Scene = { idx: number; title: string; body: string };

// ---------- 환경 검증 ----------

function requireEnv(): void {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error('[poc-text] GOOGLE_GENERATIVE_AI_API_KEY 또는 GOOGLE_API_KEY 환경변수가 없습니다.');
    console.error('  1) https://aistudio.google.com 에서 API key 발급');
    console.error('  2) 프로젝트 루트 .env.local 또는 .env 에 다음 중 한 줄 추가:');
    console.error('     GOOGLE_GENERATIVE_AI_API_KEY=<키>');
    console.error('     GOOGLE_API_KEY=<키>');
    process.exit(1);
  }
}

// ---------- 사용자 프롬프트 빌더 ----------

function buildUserPrompt(): string {
  const conv = CONVERSATION.map((t) => `${t.role === 'ai' ? '[AI]' : '[아이]'} ${t.text}`).join('\n');
  const frames = SCENE_FRAMES.map((s) => `- 장면${s.idx}: ${s.frame}`).join('\n');

  return [
    `책 제목: ${BOOK.title} (${BOOK.author})`,
    `원작 줄거리: ${BOOK.summary}`,
    '',
    '아이와 나눈 대화 (이 내용을 본문에 반영):',
    conv,
    '',
    `장면 ${SCENE_FRAMES.length}개의 틀:`,
    frames,
    '',
    `위 틀에 따라 ${SCENE_FRAMES.length}개 장면을 JSON 배열로 작성해주세요.`,
  ].join('\n');
}

// ---------- JSON 추출 (코드블록·잡음 대비) ----------

function extractJsonArray(raw: string): unknown {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced ? fenced[1] : raw).trim();
  const start = candidate.indexOf('[');
  const end = candidate.lastIndexOf(']');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`응답에서 JSON 배열을 찾을 수 없습니다.\n원본:\n${raw}`);
  }
  const sliced = candidate.slice(start, end + 1);
  return JSON.parse(sliced);
}

function validateScenes(parsed: unknown): Scene[] {
  if (!Array.isArray(parsed)) {
    throw new Error('JSON 루트가 배열이 아닙니다.');
  }
  return parsed.map((item, i) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`항목 ${i}이 객체가 아닙니다.`);
    }
    const o = item as Record<string, unknown>;
    if (typeof o.idx !== 'number' || typeof o.title !== 'string' || typeof o.body !== 'string') {
      throw new Error(`항목 ${i} 스키마 불일치: ${JSON.stringify(item)}`);
    }
    return { idx: o.idx, title: o.title, body: o.body };
  });
}

// ---------- 메인 ----------

async function main() {
  requireEnv();

  const outDir = path.resolve(process.cwd(), 'tmp');
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`[poc-text] 장면 ${SCENE_FRAMES.length}개 텍스트 생성 중... (책: ${BOOK.title})`);

  const result = await generateText({
    model: MODEL,
    maxRetries: 0,
    system: SYSTEM_PROMPT,
    prompt: buildUserPrompt(),
  });

  const parsed = extractJsonArray(result.text);
  const scenes = validateScenes(parsed);

  // 콘솔 표시
  console.log('\n[poc-text] 생성 결과:');
  for (const s of scenes) {
    console.log(`\n  장면 ${s.idx} — ${s.title}`);
    console.log(`    ${s.body}`);
  }

  // 파일 저장
  const filePath = path.join(outDir, 'scenes.json');
  fs.writeFileSync(filePath, JSON.stringify(scenes, null, 2) + '\n');
  console.log(`\n[poc-text] 저장: ${filePath}`);
  console.log('프롬프트/장면 틀은 scripts/poc-text.ts 상단에서 자유롭게 수정 후 재실행 가능합니다.');
}

main().catch((err) => {
  console.error('[poc-text] 실패:', err);
  process.exit(1);
});
