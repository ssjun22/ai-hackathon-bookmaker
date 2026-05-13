// localStorage 기반 나의 서재 저장소 추상화
// 단일 브라우저·단일 세션 가정 (V1 mock)
// 실제 DB 교체 시 saveBook / listBooks / getBook 시그니처만 유지하면 됨

const STORAGE_KEY = "my-library-books";

export type SavedPage = {
  pageNumber: number;
  title: string;
  body: string;
  colorPalette: string;
  emoji: string;
  imageUrl?: string;
};

export type SavedBook = {
  /** crypto.randomUUID()로 발급 */
  id: string;
  storyTitle: string;
  /** 표지(1장) 이모지 */
  coverEmoji: string;
  /** 표지(1장) 배경색 */
  colorPalette: string;
  pages: SavedPage[];
  createdAt: string; // ISO8601
};

// SSR 안전 가드
function isClient(): boolean {
  return typeof window !== "undefined";
}

function readAll(): SavedBook[] {
  if (!isClient()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedBook[];
  } catch {
    return [];
  }
}

function writeAll(books: SavedBook[]): void {
  if (!isClient()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch {
    // localStorage 용량 초과 등 — 데모에서는 무시
  }
}

/** 책 저장. 같은 id가 있으면 덮어쓴다. */
export function saveBook(book: SavedBook): void {
  const all = readAll();
  const idx = all.findIndex((b) => b.id === book.id);
  if (idx >= 0) {
    all[idx] = book;
  } else {
    all.push(book);
  }
  writeAll(all);
}

/** 저장된 책 전체 목록 (최신 순) */
export function listBooks(): SavedBook[] {
  return readAll().slice().reverse();
}

/** ID로 단일 책 조회. 없으면 null. */
export function getBook(id: string): SavedBook | null {
  return readAll().find((b) => b.id === id) ?? null;
}
