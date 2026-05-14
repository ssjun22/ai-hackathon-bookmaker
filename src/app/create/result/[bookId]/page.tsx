"use client";

import { use, useEffect, useState } from "react";
import type { MyBook, StoryPage } from "@/lib/types";
import ResultCarousel from "@/components/ResultCarousel";

interface ResultPageProps {
  params: Promise<{ bookId: string }>;
}

export default function ResultPage({ params }: ResultPageProps) {
  const { bookId } = use(params);
  const [data, setData] = useState<MyBook | null | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/my-books/${bookId}`);
        if (res.ok) {
          const json: MyBook = await res.json();
          setData(json);
        } else {
          setData(null);
        }
      } catch {
        setData(null);
      }
    })();
  }, [bookId]);

  if (data === undefined) {
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
          결과 불러오는 중...
        </p>
      </main>
    );
  }

  if (data === null) {
    return (
      <main
        style={{
          minHeight: "calc(100dvh - 56px - 64px)",
          backgroundColor: "var(--color-beige)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <p style={{ color: "var(--color-brown)", fontSize: 16, fontWeight: 700, textAlign: "center" }}>
          결과를 찾을 수 없어요.
        </p>
      </main>
    );
  }

  // MyBookPage[] → StoryPage[] 변환 (bodyCandidates 빈 배열 주입)
  const mappedPages: StoryPage[] = data.pages.map((p) => ({
    ...p,
    bodyCandidates: [],
  }));

  return (
    <main
      style={{
        minHeight: "calc(100dvh - 56px - 64px)",
        backgroundColor: "var(--color-beige)",
      }}
    >
      <ResultCarousel storyTitle={data.storyTitle} pages={mappedPages} />
    </main>
  );
}
