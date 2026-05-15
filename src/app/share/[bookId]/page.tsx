"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { MyBook } from "@/lib/types";
import { MOCK_MY_BOOK } from "@/lib/mockFriendBooks";
import ShareClient from "@/components/share/ShareClient";

interface SharePageProps {
  params: Promise<{ bookId: string }>;
}

export default function SharePage({ params }: SharePageProps) {
  const { bookId } = use(params);
  const router = useRouter();
  const [book, setBook] = useState<MyBook | null | undefined>(undefined);

  useEffect(() => {
    // 데모 진입: 실제 책 없이 화면을 바로 확인할 수 있게 mock 사용
    if (bookId === "demo") {
      setBook(MOCK_MY_BOOK);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/my-books/${bookId}`);
        if (res.ok) {
          const data: MyBook = await res.json();
          setBook(data);
        } else {
          // 책을 못 찾으면 mock으로 폴백 — 데모 흐름을 막지 않기 위함
          setBook(MOCK_MY_BOOK);
        }
      } catch {
        setBook(MOCK_MY_BOOK);
      }
    })();
  }, [bookId]);

  if (book === undefined) {
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
          공유 화면 불러오는 중...
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

  return (
    <main
      style={{
        minHeight: "calc(100dvh - 56px - 64px)",
        backgroundColor: "var(--color-beige)",
      }}
    >
      <ShareClient book={book} />
    </main>
  );
}
