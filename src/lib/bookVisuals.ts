// 원작 책의 시각 토큰 (palette, motif, ribbonColor) 정적 매핑
// DB는 식별자·메타 데이터만 가지며, 시각 토큰은 이 파일이 관리한다.
// 신규 책 추가 시 아래 BOOK_VISUALS에 항목을 추가한다.

export type Palette = {
  bg: string;
  accent: string;
  bgDark?: string;
  titleColor?: string;
};

export type Motif = 'star' | 'forest' | 'rabbit' | 'carrot';

export type BookVisuals = {
  palette: Palette;
  motif: Motif;
  ribbonColor: string;
  /** public/books/ 아래 파일명 (한글 포함). library 페이지 본문 로딩용. */
  contentFile: string;
  /** library 페이지에서 책등으로 표시할 이미지 (public 기준 경로) */
  spineImage: string;
  /** 책 모달 상단에 표시할 대표 이미지 (선택). public 기준 경로. */
  bannerImage?: string;
  /** 책 읽어주기 녹음 파일 (선택). 있으면 TTS 대신 재생. public 기준 경로. */
  audioFile?: string;
};

const BOOK_VISUALS: Record<string, BookVisuals> = {
  star: {
    palette: { bg: '#3B5C8F', accent: '#F7D572', titleColor: '#F7D572' },
    motif: 'star',
    ribbonColor: '#D85F4A',
    contentFile: '냄새 맡은 값.txt',
    spineImage: '/ui/story1.png',
    bannerImage: '/ui/story1_img.png',
  },
  forest: {
    palette: { bg: '#7FA84B', accent: '#3D2E1E', titleColor: '#FFFBF0' },
    motif: 'forest',
    ribbonColor: '#E8A838',
    contentFile: '소금을 만드는 맷돌.txt',
    spineImage: '/ui/story2.png',
    bannerImage: '/ui/story2_img.png',
  },
  rabbit: {
    palette: { bg: '#EC9CAE', accent: '#FFFFFF', titleColor: '#3D2E1E' },
    motif: 'rabbit',
    ribbonColor: '#7CB5E0',
    contentFile: '송아지와 바꾼 무.txt',
    spineImage: '/ui/story3.png',
    bannerImage: '/ui/story3_img.png',
    audioFile: '/story3.wav',
  },
  brave: {
    palette: { bg: '#D9BC3E', accent: '#5C8240', titleColor: '#3D2E1E' },
    motif: 'carrot',
    ribbonColor: '#95C566',
    contentFile: '소금장수와 기름장수.txt',
    spineImage: '/ui/story4.png',
    bannerImage: '/ui/story4_img.png',
  },
};

const FALLBACK_VISUALS: BookVisuals = {
  palette: { bg: '#A07850', accent: '#F7D572', titleColor: '#FFFBF0' },
  motif: 'star',
  ribbonColor: '#8B6B45',
  contentFile: '',
  spineImage: '/ui/story1.png',
};

/**
 * bookId에 대응하는 시각 토큰을 반환한다.
 * 미등록 bookId는 fallback 기본값을 반환한다.
 */
export function getBookVisuals(bookId: string): BookVisuals {
  return BOOK_VISUALS[bookId] ?? FALLBACK_VISUALS;
}

/**
 * 등록된 모든 bookId 목록을 반환한다.
 */
export function registeredBookIds(): string[] {
  return Object.keys(BOOK_VISUALS);
}
