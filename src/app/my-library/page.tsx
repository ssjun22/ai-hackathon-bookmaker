"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MyLibraryClient from "@/components/MyLibraryClient";

// useSearchParams를 사용하는 내부 컴포넌트 — Suspense 경계 내부에 위치
function MyLibraryInner() {
  const searchParams = useSearchParams();
  const newBookId = searchParams.get("new");

  return <MyLibraryClient newBookId={newBookId} />;
}

export default function MyLibraryPage() {
  return (
    <main
      style={{
        minHeight: "calc(100dvh - 56px - 64px)",
        backgroundColor: "var(--color-beige)",
      }}
    >
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "calc(100dvh - 56px - 64px)",
            }}
          >
            <p style={{ color: "var(--color-brown-soft)", fontSize: 14 }}>
              서재 불러오는 중...
            </p>
          </div>
        }
      >
        <MyLibraryInner />
      </Suspense>
    </main>
  );
}
