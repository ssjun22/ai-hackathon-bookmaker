import fs from "node:fs/promises";
import path from "node:path";
import { books } from "@/data/books";
import LibraryClient from "@/components/LibraryClient";

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
  throw new Error(`Cannot read book file: ${contentFile}`);
}

export default async function LibraryPage() {
  // 각 책의 본문을 서버에서 미리 읽어 클라이언트에 전달
  const booksWithContent = await Promise.all(
    books.map(async (book) => {
      const content = await readBookContent(book.contentFile);
      return { ...book, content };
    })
  );

  return (
    <main
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--color-beige)",
        paddingBottom: 100, // TabBar 높이 확보
      }}
    >
      <LibraryClient booksWithContent={booksWithContent} />
    </main>
  );
}
