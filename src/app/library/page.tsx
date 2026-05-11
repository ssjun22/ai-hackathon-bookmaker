import fs from "node:fs/promises";
import path from "node:path";
import { books } from "@/data/books";
import LibraryClient from "@/components/LibraryClient";

export default async function LibraryPage() {
  // 각 책의 본문을 서버에서 미리 읽어 클라이언트에 전달
  const booksWithContent = await Promise.all(
    books.map(async (book) => {
      const filePath = path.join(process.cwd(), "public", "books", book.contentFile);
      const content = await fs.readFile(filePath, "utf-8");
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
