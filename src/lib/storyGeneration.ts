import 'server-only';

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import type { ChatAnswer } from '@/lib/types';

// ── 타입 ──────────────────────────────────────────────────────────────────────

export type Scene = {
  idx: number;
  title: string;
  body: string;
};

export type BookTextResult = {
  storyTitle: string;
  coverEmoji: string;
  colorPalette: string;
  scenes: Scene[];
};

// ── 정적 책 메타 ───────────────────────────────────────────────────────────────

const BOOK_META: Record<string, { title: string; author: string; summary: string }> = {
  star: {
    title: '냄새 맡은 값',
    author: '전래동화',
    summary: '장터에서 풍겨오는 국밥 냄새를 공짜로 맡은 사내를 주막 주인이 고소했지만, 원님은 "냄새 맡은 값은 돈 소리로 내면 된다"는 명쾌한 판결을 내린다. 지혜로운 해결로 욕심을 꼬집는 이야기.',
  },
  forest: {
    title: '소금을 만드는 맷돌',
    author: '전래동화',
    summary: '소금을 무한정 만드는 마법 맷돌을 훔친 선장이 멈추는 주문을 몰라 배 안에서 소금을 계속 만들다 배가 가라앉아 버린다. 욕심의 결말을 담은 이야기.',
  },
  rabbit: {
    title: '송아지와 바꾼 무',
    author: '전래동화',
    summary: '마음씨 좋은 농부가 커다란 무를 원님께 정성껏 선물하자 원님은 기뻐하며 말 한 필을 내려줍니다. 이 소식을 들은 욕심쟁이 부자가 비단을 갖다 바쳤더니 원님은 "마침 좋은 것이 생겼소"라며 농부에게 받은 무를 돌려줍니다. 진심 어린 마음이 가장 값진 선물임을 깨닫게 해 주는 이야기.',
  },
  brave: {
    title: '소금장수와 기름장수',
    author: '전래동화',
    summary: '좁은 다리에서 소금짐과 기름짐을 진 두 사람이 마주쳤을 때, 지나가던 노인의 지혜로운 조언 덕분에 서로 양보하며 모두 무사히 건너간다. 양보와 배려의 지혜를 담은 이야기.',
  },
};

const FALLBACK_BOOK_META = {
  title: '전래동화',
  author: '전래동화',
  summary: '우리나라 옛날이야기',
};

// ── 상수 ──────────────────────────────────────────────────────────────────────

const TEXT_MODEL = google('gemini-3.1-flash-lite-preview');
const IMAGE_MODEL = google('gemini-3.1-flash-image-preview');
const IMAGE_SIZE = '512' as const;
const ASPECT_RATIO = '2:3';

const SYSTEM_PROMPT = `당신은 한국 전래동화를 아이의 취향에 맞춰 새로 쓰는 작가입니다.

규칙:
- 한국어로 작성
- 각 장면 본문은 1-2문장, 40-60자 정도의 짧고 운율감 있는 동화책 톤
- 따뜻하고 평화로운 분위기 유지 (폭력/공포/자극 없음)
- 아이의 답변 내용(보라색 호박, 따뜻한 시골 풍경 등)을 자연스럽게 반영
- 장면 사이 흐름이 자연스럽게 이어져야 함
- 마지막 장면은 동화의 결말(여운/교훈)로 마무리

출력은 반드시 JSON 배열이어야 하며, 각 항목은 { "idx": number, "title": string, "body": string } 형식입니다.
title은 8자 이내의 장면 제목, body는 본문입니다.
JSON 외 다른 텍스트는 출력하지 마세요. 코드블록 마크다운(\`\`\`)도 사용하지 마세요.`;

const SCENE_FRAMES = [
  { idx: 1, frame: '원작의 핵심 사건을 동화책 첫 장면으로 소개' },
  { idx: 2, frame: '갈등이나 전환점이 드러나는 장면' },
  { idx: 3, frame: '(원문 결말 이후 자유 내용 — 다음 장면과 자연스럽게 이어지도록 작성)' },
  { idx: 4, frame: '(원문 결말 이후 자유 내용 — 동화의 결말로 자연스럽게 마무리)' },
];

const IMAGE_SYSTEM_TONE = [
  '한국 전래동화 그림책 스타일. 따뜻한 수채화 느낌. 부드러운 색감. 아이가 보기 편한 일러스트. 폭력/공포 없음.',
  '한 이미지에는 한 장면, 한 순간만 그립니다. 분할 컷·만화 스트립·여러 패널·좌우 분할 금지.',
  '이미지 안에 글자(한글/영문 텍스트 오버레이, 말풍선, 제목, 캡션) 넣지 않습니다.',
].join('\n');

const SCENE_GUIDE =
  '본문에 여러 행동/시간이 등장해도 가장 결정적인 한 순간만 골라 단일 장면으로 그립니다. 절대 두 장면을 한 그림에 같이 담지 마세요.';

// ── 내부 유틸 ─────────────────────────────────────────────────────────────────

function extractJsonArray(raw: string): unknown {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced ? fenced[1] : raw).trim();
  const start = candidate.indexOf('[');
  const end = candidate.lastIndexOf(']');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`응답에서 JSON 배열을 찾을 수 없습니다.\n원본:\n${raw}`);
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

function validateScenes(parsed: unknown): Scene[] {
  if (!Array.isArray(parsed)) throw new Error('JSON 루트가 배열이 아닙니다.');
  return parsed.map((item, i) => {
    if (typeof item !== 'object' || item === null)
      throw new Error(`항목 ${i}이 객체가 아닙니다.`);
    const o = item as Record<string, unknown>;
    if (
      typeof o.idx !== 'number' ||
      typeof o.title !== 'string' ||
      typeof o.body !== 'string'
    )
      throw new Error(`항목 ${i} 스키마 불일치: ${JSON.stringify(item)}`);
    return { idx: o.idx as number, title: o.title as string, body: o.body as string };
  });
}

function buildUserPrompt(
  book: { title: string; author: string; summary: string },
  answers: ChatAnswer[]
): string {
  // ChatAnswer[] → CONVERSATION 형태로 변환
  const conv = answers
    .map((a) => `[AI] ${a.question}\n[아이] ${a.answer}`)
    .join('\n');

  const frames = SCENE_FRAMES.map((s) => `- 장면${s.idx}: ${s.frame}`).join('\n');

  return [
    `책 제목: ${book.title} (${book.author})`,
    `원작 줄거리: ${book.summary}`,
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

function buildCoverMeta(bookId: string): { coverEmoji: string; colorPalette: string } {
  const META: Record<string, { coverEmoji: string; colorPalette: string }> = {
    star: { coverEmoji: '⭐', colorPalette: '#3B5C8F' },
    forest: { coverEmoji: '🌊', colorPalette: '#7FA84B' },
    rabbit: { coverEmoji: '🥕', colorPalette: '#EC9CAE' },
    brave: { coverEmoji: '🧂', colorPalette: '#D9BC3E' },
  };
  return META[bookId] ?? { coverEmoji: '📖', colorPalette: '#A07850' };
}

// ── 공개 함수 ─────────────────────────────────────────────────────────────────

/**
 * bookId와 채팅 답변을 받아 LLM으로 동화 텍스트(Scene[])를 생성한다.
 */
export async function generateBookText(
  bookId: string,
  answers: ChatAnswer[]
): Promise<BookTextResult> {
  const book = BOOK_META[bookId] ?? FALLBACK_BOOK_META;
  const { coverEmoji, colorPalette } = buildCoverMeta(bookId);

  const result = await generateText({
    model: TEXT_MODEL,
    maxRetries: 0,
    system: SYSTEM_PROMPT,
    prompt: buildUserPrompt(book, answers),
  });

  const parsed = extractJsonArray(result.text);
  const scenes = validateScenes(parsed);

  return {
    storyTitle: `${book.title} — 나만의 이야기`,
    coverEmoji,
    colorPalette,
    scenes,
  };
}

/**
 * scenes를 바탕으로 reference 이미지 1장을 생성하여 Buffer로 반환한다.
 */
export async function generateReferenceImage(
  bookId: string,
  answers: ChatAnswer[]
): Promise<Buffer> {
  const book = BOOK_META[bookId] ?? FALLBACK_BOOK_META;
  const userVoices = answers.map((a) => `- ${a.answer}`).join('\n');

  const prompt = [
    IMAGE_SYSTEM_TONE,
    `책 제목: ${book.title} (${book.author})`,
    `독자 요청 요약:\n${userVoices}`,
    '',
    `한국 전래동화 그림책 스타일 ... 따뜻하고 둥근 인상의 주인공, 부드러운 미소, 한복 또는 옛 복장, 정면 클로즈업, 단순한 배경, 따뜻한 파스텔 톤.`,
  ].join('\n');

  const result = await generateText({
    model: IMAGE_MODEL,
    maxRetries: 0,
    prompt,
    providerOptions: {
      google: {
        responseModalities: ['IMAGE'],
        imageConfig: { imageSize: IMAGE_SIZE, aspectRatio: ASPECT_RATIO },
      },
    },
  });

  const imageFile = result.files?.find((f) => f.mediaType?.startsWith('image/'));
  if (!imageFile) {
    throw new Error('reference 응답에 이미지가 없습니다.');
  }

  return Buffer.from(imageFile.uint8Array);
}

/**
 * 단일 Scene과 reference Buffer를 받아 장면 이미지를 생성하여 Buffer로 반환한다.
 */
export async function generateSceneImage(
  scene: Scene,
  referenceBuffer: Buffer
): Promise<Buffer> {
  const sceneText = `장면 ${scene.idx} — ${scene.title}: ${scene.body}`;

  const result = await generateText({
    model: IMAGE_MODEL,
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
          {
            type: 'text',
            text: `${IMAGE_SYSTEM_TONE}\n\n${SCENE_GUIDE}\n\n위 참조 이미지의 캐릭터 외형과 그림체를 그대로 유지하면서 다음 장면을 그려줘:\n${sceneText}`,
          },
          { type: 'image', image: referenceBuffer },
        ],
      },
    ],
  });

  const imageFile = result.files?.find((f) => f.mediaType?.startsWith('image/'));
  if (!imageFile) {
    throw new Error(`장면 ${scene.idx} 응답에 이미지가 없습니다.`);
  }

  return Buffer.from(imageFile.uint8Array);
}
