"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBook } from "@/lib/myBookStorage";
import type { SavedBook, SavedPage } from "@/lib/myBookStorage";
import type { StoryPage } from "@/data/mockResults";
import ResultCarousel from "@/components/ResultCarousel";

interface BookViewerPageProps {
  params: Promise<{ bookId: string }>;
}

/** SavedPage[] → StoryPage[] 어댑터 (ResultCarousel 재사용용) */
function toStoryPages(pages: SavedPage[]): StoryPage[] {
  return pages.map((p) => ({
    pageNumber: p.pageNumber,
    title: p.title,
    body: p.body,
    colorPalette: p.colorPalette,
    emoji: p.emoji,
    imageUrl: p.imageUrl,
    bodyCandidates: [], // 뷰어는 읽기 전용 — 보기 후보 불필요
  }));
}

export default function BookViewerPage({ params }: BookViewerPageProps) {
  const { bookId } = use(params);
  const router = useRouter();
  const [book, setBook] = useState<SavedBook | null | undefined>(undefined);

  useEffect(() => {
    const found = getBook(bookId);
    setBook(found);
  }, [bookId]);

  if (book === undefined) {
    // 로딩 중
    return (
      <main
        style={{
          minHeight: "calc(100dvh - 56px - 64px)",
          backgroundColor: "var(--color-beige)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--color-brown-soft)", fontSize: 14 }}>
          책 불러오는 중...
        </p>
      </main>
    );
  }

  if (book === null) {
    return (
      <main
        style={{
          minHeight: "calc(100dvh - 56px - 64px)",
          backgroundColor: "var(--color-beige)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: "20px",
        }}
      >
        <span style={{ fontSize: 48 }}>📭</span>
        <p
          style={{
            color: "var(--color-brown)",
            fontSize: 16,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          책을 찾을 수 없어요
        </p>
        <p
          style={{
            color: "var(--color-brown-soft)",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          삭제되었거나 잘못된 링크일 수 있어요.
        </p>
        <button
          type="button"
          onClick={() => router.push("/my-library")}
          style={{
            padding: "12px 24px",
            borderRadius: 24,
            border: "none",
            backgroundColor: "var(--color-brown)",
            color: "#fffdf8",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            cursor: "pointer",
            boxShadow: "var(--shadow-clay-sm)",
          }}
        >
          서재로 돌아가기
        </button>
      </main>
    );
  }

  const storyPages = toStoryPages(book.pages);

  return (
    <main
      style={{
        minHeight: "calc(100dvh - 56px - 64px)",
        backgroundColor: "var(--color-beige)",
      }}
    >
      <ResultCarousel storyTitle={book.storyTitle} pages={storyPages} />

      {/* 서재로 돌아가기 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: 32,
          marginTop: -16,
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/my-library")}
          style={{
            padding: "12px 24px",
            borderRadius: 24,
            border: "2px solid var(--color-brown)",
            backgroundColor: "transparent",
            color: "var(--color-brown)",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            cursor: "pointer",
          }}
        >
          ← 서재로 돌아가기
        </button>
      </div>
    </main>
  );
}
