// 공용 도메인 타입 — 모든 컴포넌트·API Route에서 이 파일을 참조한다

// 채팅 Q&A 답변 단위
export type ChatAnswer = {
  questionId: string;
  question: string;
  answer: string;
};

// 사용자가 만든 책의 페이지 (구 SavedPage)
export type MyBookPage = {
  pageNumber: number;
  title: string;
  body: string;
  colorPalette: string;
  emoji: string;
  imageUrl?: string;
};

// AI 사전 생성 페이지 — 보기 후보 포함 (구 StoryPage)
export type StoryPage = MyBookPage & {
  bodyCandidates: string[];
};

// 사용자가 만든 책 (구 SavedBook)
export type MyBook = {
  id: string;
  storyTitle: string;
  coverEmoji: string;
  colorPalette: string;
  pages: MyBookPage[];
  createdAt: string; // ISO8601
};

// 원작 카탈로그 책 (DB 기반, 시각 토큰 제외)
export type Book = {
  id: string;
  title: string;
  author: string;
  summary: string;
  coverImageUrl?: string;
};
