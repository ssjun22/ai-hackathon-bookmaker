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
};

const BOOK_VISUALS: Record<string, BookVisuals> = {
  star: {
    palette: { bg: '#3B5C8F', accent: '#F7D572', titleColor: '#F7D572' },
    motif: 'star',
    ribbonColor: '#D85F4A',
  },
  forest: {
    palette: { bg: '#7FA84B', accent: '#3D2E1E', titleColor: '#FFFBF0' },
    motif: 'forest',
    ribbonColor: '#E8A838',
  },
  rabbit: {
    palette: { bg: '#EC9CAE', accent: '#FFFFFF', titleColor: '#3D2E1E' },
    motif: 'rabbit',
    ribbonColor: '#7CB5E0',
  },
  brave: {
    palette: { bg: '#D9BC3E', accent: '#5C8240', titleColor: '#3D2E1E' },
    motif: 'carrot',
    ribbonColor: '#95C566',
  },
};

const FALLBACK_VISUALS: BookVisuals = {
  palette: { bg: '#A07850', accent: '#F7D572', titleColor: '#FFFBF0' },
  motif: 'star',
  ribbonColor: '#8B6B45',
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
