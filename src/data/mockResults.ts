// 4권 동화책 mock 결과 데이터
// 각 책의 id는 books.ts의 id와 일치해야 함 (star, forest, rabbit, brave)

export type StoryPage = {
  /** 장 번호 (1-based) */
  pageNumber: number;
  /** 장 제목 */
  title: string;
  /** 본문 텍스트 */
  body: string;
  /** 배경 컬러 (hex) */
  colorPalette: string;
  /** 장면 대표 이모지 */
  emoji: string;
};

export type MockResult = {
  bookId: string;
  storyTitle: string;
  pages: StoryPage[];
};

const mockResults: Record<string, MockResult> = {
  star: {
    bookId: "star",
    storyTitle: "냄새 맡은 값 — 나의 동화",
    pages: [
      {
        pageNumber: 1,
        title: "표지",
        body: "어느 날 밤, 구수한 냄새가 바람을 타고 골목을 가득 채웠어요. 그 냄새의 주인공은 과연 누구일까요?",
        colorPalette: "#3B5C8F",
        emoji: "🌙",
      },
      {
        pageNumber: 2,
        title: "냄새를 맡다",
        body: "가난한 나그네는 밥집 앞을 지나며 구수한 냄새를 힘껏 들이마셨어요. 배가 든든해진 기분이었지요.",
        colorPalette: "#4A6FA0",
        emoji: "👃",
      },
      {
        pageNumber: 3,
        title: "값을 달라!",
        body: "밥집 주인은 소리쳤어요. '냄새 맡은 값을 내시오!' 나그네는 깜짝 놀라 아무 말도 하지 못했어요.",
        colorPalette: "#5A3E2B",
        emoji: "💬",
      },
      {
        pageNumber: 4,
        title: "현명한 판결",
        body: "지혜로운 원님이 나서서 말했어요. '냄새 값은 돈 소리로 내면 되오.' 짤랑짤랑, 동전 소리가 울렸어요.",
        colorPalette: "#F7D572",
        emoji: "⚖️",
      },
      {
        pageNumber: 5,
        title: "깨달음",
        body: "욕심쟁이 주인은 고개를 숙였어요. 진짜 소중한 것은 눈에 보이지 않을 수도 있답니다.",
        colorPalette: "#D4A843",
        emoji: "💡",
      },
      {
        pageNumber: 6,
        title: "결말",
        body: "그날 이후 밥집 앞을 지나는 나그네들은 모두 행복한 웃음을 지었어요. 냄새는 모두를 위한 것이었으니까요.",
        colorPalette: "#2E4A70",
        emoji: "😊",
      },
    ],
  },

  forest: {
    bookId: "forest",
    storyTitle: "소금을 만드는 맷돌 — 나의 동화",
    pages: [
      {
        pageNumber: 1,
        title: "표지",
        body: "깊은 바닷속 어딘가에, 지금도 쉬지 않고 소금을 만들어 내는 마법의 맷돌이 있다고 해요.",
        colorPalette: "#7FA84B",
        emoji: "🌊",
      },
      {
        pageNumber: 2,
        title: "신기한 선물",
        body: "착한 형은 요정에게 마법 맷돌을 선물 받았어요. '소금 나와라!' 하면 소금이, '그만!' 하면 멈춘대요.",
        colorPalette: "#8DC55A",
        emoji: "🎁",
      },
      {
        pageNumber: 3,
        title: "욕심쟁이 선장",
        body: "탐욕스러운 선장이 맷돌을 훔쳐 배에 올랐어요. '소금 나와라!' 소금이 쏟아지기 시작했어요.",
        colorPalette: "#3D6B2E",
        emoji: "⚓",
      },
      {
        pageNumber: 4,
        title: "멈출 수 없어",
        body: "'그만!'이라는 말을 몰랐던 선장. 소금은 점점 쌓여 배가 기울기 시작했어요.",
        colorPalette: "#5A4A3A",
        emoji: "😱",
      },
      {
        pageNumber: 5,
        title: "바닷속으로",
        body: "배는 결국 소금 무게를 이기지 못하고 바닷속으로 가라앉았어요. 맷돌도 함께요.",
        colorPalette: "#2A5A8C",
        emoji: "🌊",
      },
      {
        pageNumber: 6,
        title: "결말",
        body: "그래서 오늘도 바다는 짜다고 해요. 욕심은 결국 자신을 가라앉히고 마니까요.",
        colorPalette: "#7FA84B",
        emoji: "🌿",
      },
    ],
  },

  rabbit: {
    bookId: "rabbit",
    storyTitle: "송아지와 바꾼 무 — 나의 동화",
    pages: [
      {
        pageNumber: 1,
        title: "표지",
        body: "조그마한 무 하나로 시작한 교환이 어떻게 끝날지, 우리 함께 따라가 볼까요?",
        colorPalette: "#EC9CAE",
        emoji: "🥕",
      },
      {
        pageNumber: 2,
        title: "큰 무",
        body: "농부가 커다란 무를 캤어요. 너무 크고 맛있어 보여서 원님께 선물로 드리기로 했지요.",
        colorPalette: "#F2B3C3",
        emoji: "🌱",
      },
      {
        pageNumber: 3,
        title: "말 한 필",
        body: "원님은 기뻐하며 말 한 필을 내려주었어요. 농부는 무 하나로 말을 얻었어요!",
        colorPalette: "#D4849A",
        emoji: "🐴",
      },
      {
        pageNumber: 4,
        title: "욕심쟁이 부자",
        body: "이 소식을 들은 욕심쟁이 부자는 비싼 비단을 원님께 드렸어요. '나는 더 큰 선물을 받겠지!'",
        colorPalette: "#B87090",
        emoji: "💰",
      },
      {
        pageNumber: 5,
        title: "무를 받다",
        body: "원님은 웃으며 말했어요. '마침 좋은 것이 생겼소. 농부에게 받은 진귀한 무라오!'",
        colorPalette: "#EC9CAE",
        emoji: "😂",
      },
      {
        pageNumber: 6,
        title: "결말",
        body: "진심 어린 마음이 담긴 선물이 가장 값진 것이에요. 욕심으로 드린 선물은 결국 빈손으로 돌아왔답니다.",
        colorPalette: "#C8789A",
        emoji: "💝",
      },
    ],
  },

  brave: {
    bookId: "brave",
    storyTitle: "소금장수와 기름장수 — 나의 동화",
    pages: [
      {
        pageNumber: 1,
        title: "표지",
        body: "두 장수가 좁은 다리 위에서 마주쳤어요. 한 발짝도 물러서지 않으려는 두 사람의 이야기예요.",
        colorPalette: "#D9BC3E",
        emoji: "🌉",
      },
      {
        pageNumber: 2,
        title: "만남",
        body: "소금장수와 기름장수가 외나무다리에서 딱 마주쳤어요. 둘 다 먼저 건너려 했지요.",
        colorPalette: "#E8CC50",
        emoji: "🤝",
      },
      {
        pageNumber: 3,
        title: "실랑이",
        body: "'내가 먼저요!' '아니, 내가 먼저!' 실랑이가 계속되자 지나가던 사람들이 구경하기 시작했어요.",
        colorPalette: "#C4A030",
        emoji: "😤",
      },
      {
        pageNumber: 4,
        title: "지혜",
        body: "노인이 다가와 말했어요. '한 사람이 다리 난간에 기대면 다른 사람이 지나갈 수 있소.'",
        colorPalette: "#5C8240",
        emoji: "🧓",
      },
      {
        pageNumber: 5,
        title: "양보",
        body: "소금장수가 먼저 양보했어요. 기름장수도 고마운 마음에 소금을 조금 사주었지요.",
        colorPalette: "#7A9E5A",
        emoji: "🙏",
      },
      {
        pageNumber: 6,
        title: "결말",
        body: "양보 한 번으로 둘은 단짝 친구가 되었어요. 고집보다 배려가 더 멀리 데려다 준답니다.",
        colorPalette: "#D9BC3E",
        emoji: "🌟",
      },
    ],
  },
};

export default mockResults;
