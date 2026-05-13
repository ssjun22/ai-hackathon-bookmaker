import fs from "node:fs/promises";
import path from "node:path";
import LibraryClient from "@/components/LibraryClient";
import { getBookVisuals, registeredBookIds } from "@/lib/bookVisuals";

// macOS(NFD)와 Linux(NFC) 한글 파일명 정규화 차이 회피용
async function readBookContent(contentFile: string): Promise<string> {
  const dir = path.join(process.cwd(), "public", "books");
  for (const form of ["NFC", "NFD"] as const) {
    try {
      return await fs.readFile(path.join(dir, contentFile.normalize(form)), "utf-8");
    } catch {
      // 다음 정규화 형태 시도
    }
  }
  return "";
}

// 정적 title/author 매핑 (books.ts 역할 대체, DB 없이도 동작)
const BOOK_META: Record<string, { title: string; author: string }> = {
  star:   { title: "냄새 맡은 값",        author: "전래동화" },
  forest: { title: "소금을 만드는 맷돌",  author: "전래동화" },
  rabbit: { title: "송아지와 바꾼 무",    author: "전래동화" },
  brave:  { title: "소금장수와 기름장수", author: "전래동화" },
};

export default async function LibraryPage() {
  const bookIds = registeredBookIds();
  const booksWithContent = await Promise.all(
    bookIds.map(async (id) => {
      const visuals = getBookVisuals(id);
      const meta = BOOK_META[id] ?? { title: id, author: "" };
      const content = visuals.contentFile
        ? await readBookContent(visuals.contentFile)
        : "";
      return {
        id,
        title: meta.title,
        author: meta.author,
        summary: "",
        content,
      };
    })
  );

  return (
    <main
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--color-beige)",
        paddingBottom: 100,
      }}
    >
      <LibraryClient booksWithContent={booksWithContent} />
    </main>
  );
}
