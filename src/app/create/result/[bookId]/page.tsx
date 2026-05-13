"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import mockResults from "@/data/mockResults";
import ResultCarousel from "@/components/ResultCarousel";

interface ResultPageProps {
  params: Promise<{ bookId: string }>;
}

export default function ResultPage({ params }: ResultPageProps) {
  const { bookId } = use(params);
  const result = mockResults[bookId];

  if (!result) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: "calc(100dvh - 56px - 64px)",
        backgroundColor: "var(--color-beige)",
      }}
    >
      <ResultCarousel storyTitle={result.storyTitle} pages={result.pages} />
    </main>
  );
}
