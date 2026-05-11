export type Palette = {
  bg: string;
  accent: string;
  bgDark?: string;
  titleColor?: string;
};

export type Motif = "star" | "forest" | "rabbit" | "carrot";

export type Book = {
  id: string;
  title: string;
  author: string;
  motif: Motif;
  palette: Palette;
  /** public/books/ 아래 파일명 (한글 포함) */
  contentFile: string;
  /** 책갈피 리본 색상 */
  ribbonColor: string;
};

export const books: Book[] = [
  {
    id: "star",
    title: "냄새 맡은 값",
    author: "전래동화",
    motif: "star",
    palette: { bg: "#3B5C8F", accent: "#F7D572", titleColor: "#F7D572" },
    contentFile: "냄새 맡은 값.txt",
    ribbonColor: "#D85F4A",
  },
  {
    id: "forest",
    title: "소금을 만드는 맷돌",
    author: "전래동화",
    motif: "forest",
    palette: { bg: "#7FA84B", accent: "#3D2E1E", titleColor: "#FFFBF0" },
    contentFile: "소금을 만드는 맷돌.txt",
    ribbonColor: "#E8A838",
  },
  {
    id: "rabbit",
    title: "송아지와 바꾼 무",
    author: "전래동화",
    motif: "rabbit",
    palette: { bg: "#EC9CAE", accent: "#FFFFFF", titleColor: "#3D2E1E" },
    contentFile: "송아지와 바꾼 무.txt",
    ribbonColor: "#7CB5E0",
  },
  {
    id: "brave",
    title: "소금장수와 기름장수",
    author: "전래동화",
    motif: "carrot",
    palette: { bg: "#D9BC3E", accent: "#5C8240", titleColor: "#3D2E1E" },
    contentFile: "소금장수와 기름장수.txt",
    ribbonColor: "#95C566",
  },
];
