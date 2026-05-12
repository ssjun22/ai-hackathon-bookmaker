import { notFound } from "next/navigation";
import mockResults from "@/data/mockResults";
import ResultCarousel from "@/components/ResultCarousel";

interface ResultPageProps {
  params: Promise<{ bookId: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { bookId } = await params;
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

// 정적 생성을 위한 경로 목록
export async function generateStaticParams() {
  return Object.keys(mockResults).map((bookId) => ({ bookId }));
}
