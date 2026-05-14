// PoC 스크립트(scripts/poc-text.ts, scripts/poc-image.ts)가 공유하는 mock 대화입니다.
//
// ↓ answer 필드만 수정해 다양한 답변에 대한 결과 변화를 확인하세요.
//   (question은 고정 — 챗봇이 묻는 4개 질문)

export type ChatTurn = { role: 'ai' | 'user'; text: string };

export const QA_PAIRS = [
  {
    question: "안녕! 오늘은 '송아지와 바꾼 무' 이야기를 다시 써볼 거야. 우리가 만들 이야기 속 농부 아저씨는 어떤 모습이면 좋겠어?",
    answer:   '주인공 모습은 원래대로 바꾸지 않을게요.',
  },
  {
    question: "좋아! 그럼 아저씨가 키울 채소는 원래 이야기에서 큰 '무'였는데, 너는 어떤 채소가 좋아?",
    answer:   '행복을 부르는 보라색 호박이요!',
  },
  {
    question: '멋져! 그럼 이 이야기의 분위기는 어떤 느낌이면 좋겠어?',
    answer:   '따뜻하고 평화로운 시골 풍경이요.',
  },
  {
    question: '마지막으로! 이 책의 마지막 장면은 어떤 느낌으로 끝나면 좋겠어?',
    answer:   '결말은 앞에서 대화한 내용을 기반으로 적절히 변경해주세요. 기본은 원문을 따르고요.',
  },
];

// QA_PAIRS → CONVERSATION 형태로 자동 합성 (수정 X)
export const CONVERSATION: ChatTurn[] = QA_PAIRS.flatMap(({ question, answer }) => [
  { role: 'ai',   text: question },
  { role: 'user', text: answer },
]);
