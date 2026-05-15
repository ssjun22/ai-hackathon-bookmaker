"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { MyBook, MyBookPage, StoryPage } from "@/lib/types";
import ResultCarousel from "@/components/ResultCarousel";

interface BookViewerPageProps {
  params: Promise<{ bookId: string }>;
}

/** MyBookPage[] → StoryPage[] 어댑터 (ResultCarousel 재사용용)
 *  표지 이미지가 있으면 첫 슬라이드로 표지 카드를 prepend.
 *  API는 coverImageUrl/storyTitle을 그대로 반환하므로 별도 수정 불필요.
 */
function toStoryPages(
  pages: MyBookPage[],
  storyTitle: string,
  coverImageUrl?: string,
): StoryPage[] {
  const scenePages: StoryPage[] = pages.map((p) => ({
    pageNumber: p.pageNumber,
    title: p.title,
    body: p.body,
    imageUrl: p.imageUrl,
    bodyCandidates: [], // 뷰어는 읽기 전용 — 보기 후보 불필요
    kind: "scene",
  }));

  if (!coverImageUrl) return scenePages;

  const coverPage: StoryPage = {
    pageNumber: 0,
    title: storyTitle,
    body: "",
    imageUrl: coverImageUrl,
    bodyCandidates: [],
    kind: "cover",
  };
  return [coverPage, ...scenePages];
}

export default function BookViewerPage({ params }: BookViewerPageProps) {
  const { bookId } = use(params);
  const router = useRouter();
  const [book, setBook] = useState<MyBook | null | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/my-books/${bookId}`);
        if (res.ok) {
          const data: MyBook = await res.json();
          setBook(data);
        } else {
          setBook(null);
        }
      } catch {
        setBook(null);
      }
    })();
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

  const storyPages = toStoryPages(book.pages, book.storyTitle, book.coverImageUrl);

  return (
    <main
      style={{
        minHeight: "calc(100dvh - 56px - 64px)",
        backgroundColor: "var(--color-beige)",
      }}
    >
      <ResultCarousel
        storyTitle={book.storyTitle}
        pages={storyPages}
        coverImageUrl={book.coverImageUrl}
        showSave={false}
      />

      {/* 액션 버튼 — 공유하기 / 서재로 돌아가기 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          paddingBottom: 32,
          marginTop: -16,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => router.push(`/share/${bookId}`)}
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
          공유하기
        </button>
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
