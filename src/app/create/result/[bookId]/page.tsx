"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import mockResults from "@/data/mockResults";
import ResultCarousel from "@/components/ResultCarousel";
import ResultEditor from "@/components/ResultEditor";

interface ResultPageProps {
  params: Promise<{ bookId: string }>;
}

export default function ResultPage({ params }: ResultPageProps) {
  const { bookId } = use(params);
  const result = mockResults[bookId];

  const [editMode, setEditMode] = useState(false);

  if (!result) {
    notFound();
  }

  if (editMode) {
    return (
      <main
        style={{
          minHeight: "calc(100dvh - 56px - 64px)",
          backgroundColor: "var(--color-beige)",
        }}
      >
        <ResultEditor
          bookId={bookId}
          storyTitle={result.storyTitle}
          pages={result.pages}
        />
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "calc(100dvh - 56px - 64px)",
        backgroundColor: "var(--color-beige)",
      }}
    >
      <ResultCarousel storyTitle={result.storyTitle} pages={result.pages} />

      {/* 편집 진입 버튼 */}
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
          onClick={() => setEditMode(true)}
          style={{
            padding: "13px 28px",
            borderRadius: 24,
            border: "2px solid var(--color-brown)",
            backgroundColor: "transparent",
            color: "var(--color-brown)",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            cursor: "pointer",
            boxShadow: "var(--shadow-clay-sm)",
          }}
        >
          ✏️ 내용 편집하기
        </button>
      </div>
    </main>
  );
}
