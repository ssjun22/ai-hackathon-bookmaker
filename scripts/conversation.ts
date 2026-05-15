// PoC 스크립트(scripts/poc-text.ts, scripts/poc-image.ts)가 공유하는 mock 대화입니다.
//
// ↓ answer 필드만 수정해 다양한 답변에 대한 결과 변화를 확인하세요.
//   (question은 고정 — 챗봇이 묻는 4개 질문)

export type ChatTurn = { role: "ai" | "user"; text: string };

export const QA_PAIRS = [
  {
    question:
      "착한 농부가 커다란 무를 사또에게 선물하자 사또가 보답으로 준 것은?",
    answer: "송아지요!",
  },
  {
    question:
      "욕심쟁이 농부가 송아지를 사또에게 선물하자 사또가 보답으로 준 것은?",
    answer: "무",
  },
  {
    question: "사또는 그것을 농부에게 주면서 어떤 생각을 했을까?",
    answer: "자신의 욕심을 반성하길 바랐을거같아요!",
  },
  {
    question: "욕심쟁이 농부는 사또에게 선물을 받고 어떤 표정을 지었을까?",
    answer: "깜짝 놀란 표정을 지엇을 것 같아요",
  },
  {
    question:
      "네가 욕심쟁이 농부라면 사또에게 받은 무를 누구에게 나누어 주고 싶어?",
    answer: "착한 농부와 옆집 할머니와 우리 부모님이요!",
  },
];

// QA_PAIRS → CONVERSATION 형태로 자동 합성 (수정 X)
export const CONVERSATION: ChatTurn[] = QA_PAIRS.flatMap(
  ({ question, answer }) => [
    { role: "ai", text: question },
    { role: "user", text: answer },
  ],
);
