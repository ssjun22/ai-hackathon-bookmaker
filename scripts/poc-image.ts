import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { generateText } from 'ai';

// ---------- 사용자 편집 영역 ----------
// 이 PROMPTS 객체의 텍스트를 자유롭게 수정해 다양한 이미지를 시도해보세요.

const MODEL = 'google/gemini-3.1-flash-image-preview';

const PROMPTS = {
  systemTone: '한국 전래동화 그림책 스타일. 따뜻한 수채화 느낌. 부드러운 색감. 아이가 보기 편한 일러스트. 폭력/공포 없음.',

  reference: `${'한국 전래동화 그림책 스타일'} ... 둥근 인상의 농부 아저씨, 따뜻한 미소, 한복 작업복, 정면 클로즈업, 단순한 시골 배경, 핑크빛 따뜻한 톤.`,

  scene1_cover: '표지. 농부 아저씨가 한 손에 큰 보라색 호박을 들고 환하게 웃는 모습. 보라색 호박은 사람 머리만 한 크기. 따뜻한 시골 들판 배경. 위쪽에 동화 제목이 들어갈 여백.',
  scene2_giant_pumpkin: '농부 아저씨가 밭에서 자신의 키만큼 자란 거대한 보라색 호박을 보고 놀라며 기뻐하는 장면. 평화로운 시골 들판. 햇살이 부드럽게 비침.',
  scene3_horse_gift: '원님이 농부에게 흰 말 한 필을 선물하는 장면. 한옥 마당. 농부는 두 손을 모아 감사 인사. 따뜻한 분위기.',
  scene5_pumpkin_back: '원님이 욕심쟁이 부자에게 보라색 호박을 돌려주는 장면. 부자는 비단을 들고 와 당황한 표정. 한옥 대청. 살짝 유머러스한 분위기.',
};

// ---------- 책 정적 데이터 ----------

const BOOK = {
  id: 'rabbit',
  title: '송아지와 바꾼 무',
  author: '전래동화',
  summary: '마음씨 좋은 농부가 커다란 무를 원님께 정성껏 선물하자 원님은 기뻐하며 말 한 필을 내려줍니다. 이 소식을 들은 욕심쟁이 부자가 비단을 갖다 바쳤더니 원님은 "마침 좋은 것이 생겼소"라며 농부에게 받은 무를 돌려줍니다. 진심 어린 마음이 가장 값진 선물임을 깨닫게 해 주는 이야기',
};

// ---------- mock 대화 (사용자 직접 작성, 챗봇 stub) ----------

const CONVERSATION = [
  { role: 'ai',   text: "안녕! 오늘은 '송아지와 바꾼 무' 이야기를 다시 써볼 거야. 우리가 만들 이야기 속 농부 아저씨는 어떤 모습이면 좋겠어?" },
  { role: 'user', text: '주인공 모습은 원래대로 바꾸지 않을게요.' },
  { role: 'ai',   text: "좋아! 그럼 아저씨가 키울 채소는 원래 이야기에서 큰 '무'였는데, 너는 어떤 채소가 좋아?" },
  { role: 'user', text: '행복을 부르는 보라색 호박이요!' },
  { role: 'ai',   text: '멋져! 그럼 이 이야기의 분위기는 어떤 느낌이면 좋겠어?' },
  { role: 'user', text: '따뜻하고 평화로운 시골 풍경이요.' },
  { role: 'ai',   text: '마지막으로! 이 책의 마지막 장면은 어떤 느낌으로 끝나면 좋겠어?' },
  { role: 'user', text: '결말은 앞에서 대화한 내용을 기반으로 적절히 변경해주세요. 기본은 원문을 따르고요.' },
];

// ---------- 환경 검증 ----------

function requireEnv(): void {
  if (!process.env.AI_GATEWAY_API_KEY) {
    console.error('[poc-image] AI_GATEWAY_API_KEY 환경변수가 없습니다.');
    console.error('  1) https://vercel.com/ai/api-keys 에서 키 발급');
    console.error('  2) 프로젝트 루트 .env.local 에 AI_GATEWAY_API_KEY=<키> 추가');
    console.error('  3) 다시 실행: pnpm tsx scripts/poc-image.ts');
    process.exit(1);
  }
}

// ---------- main ----------

async function main() {
  requireEnv();
  const outDir = path.resolve(process.cwd(), 'tmp');
  fs.mkdirSync(outDir, { recursive: true });

  // TODO T3, T4
}

main().catch((err) => {
  console.error('[poc-image] 실패:', err);
  process.exit(1);
});
