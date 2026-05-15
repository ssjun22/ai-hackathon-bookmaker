// 친구들이 만든 책 — 시연용 mock 데이터
// TODO: 추후 친구 관계 + sharedAt 기반 API로 교체

export type FriendBook = {
  id: string;
  title: string;
  authorName: string;
  coverEmoji: string;
  colorPalette: string;
};

export const mockFriendBooks: FriendBook[] = [
  {
    id: "f1",
    title: "송아지와 바꾼 무",
    authorName: "지우",
    coverEmoji: "🥕",
    colorPalette: "#F4A261",
  },
  {
    id: "f2",
    title: "큰 무가 가져온 선물",
    authorName: "하준",
    coverEmoji: "🎁",
    colorPalette: "#7BB4E0",
  },
  {
    id: "f3",
    title: "정직한 농부 이야기",
    authorName: "서연",
    coverEmoji: "👨‍🌾",
    colorPalette: "#D9C28A",
  },
  {
    id: "f4",
    title: "사또에게 간 무",
    authorName: "도윤",
    coverEmoji: "🥬",
    colorPalette: "#95C566",
  },
  {
    id: "f5",
    title: "송아지를 받은 날",
    authorName: "시아",
    coverEmoji: "🐄",
    colorPalette: "#C9A77C",
  },
  {
    id: "f6",
    title: "무 한 뿌리의 기적",
    authorName: "연우",
    coverEmoji: "🌱",
    colorPalette: "#E8A8B4",
  },
];

export type ReactionType = "smile" | "thumb" | "gift";

export const REACTION_EMOJI: Record<ReactionType, string> = {
  smile: "😊",
  thumb: "👍",
  gift: "🎁",
};

export const REACTION_LABEL: Record<ReactionType, string> = {
  smile: "스마일",
  thumb: "엄지",
  gift: "선물",
};

export const REACTION_ORDER: ReactionType[] = ["smile", "thumb", "gift"];

// 데모용 "내 책" — /share/demo 진입 시 사용
export const MOCK_MY_BOOK = {
  id: "demo",
  storyTitle: "송아지와 바꾼 무",
  coverEmoji: "🥕",
  colorPalette: "#E8A87C",
  pages: [],
  createdAt: new Date().toISOString(),
};

// 원본 책(상단 헤더) — 표지 이미지는 public/ui/story3_img.png
export const SOURCE_BOOK = {
  title: "송아지와 바꾼 무",
  imageUrl: "/ui/story3_img.png",
  coverEmoji: "🥕",
  colorPalette: "#E8A87C",
};
