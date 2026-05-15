"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { MyBook } from "@/lib/types";
import { LibraryBookCard } from "@/components/LibraryBookCard";

interface MyLibraryClientProps {
  // 신규 저장된 bookId (URL ?new=... 에서 추출해 전달)
  newBookId: string | null;
}

const SHELF_PLANK_STYLE: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  height: 14,
  background:
    "linear-gradient(to bottom, #D4B888 0%, #A0804A 55%, #7A5C30 100%)",
  borderRadius: "0 0 4px 4px",
  boxShadow:
    "0 4px 8px rgba(60,40,20,0.32), inset 0 2px 3px rgba(255,255,255,0.25), inset 0 -2px 3px rgba(0,0,0,0.18)",
};

const SHELF_WALL_STYLE: React.CSSProperties = {
  height: 24,
  background: "linear-gradient(to bottom, #F5E8C8, #EDD9A3)",
  borderRadius: "0 0 12px 12px",
  boxShadow: "inset 0 -3px 6px rgba(60,40,20,0.1)",
  position: "relative",
  zIndex: 2,
};

function ShelfBottom() {
  return (
    <>
      <div aria-hidden="true" style={SHELF_PLANK_STYLE} />
      <div aria-hidden="true" style={SHELF_WALL_STYLE} />
    </>
  );
}

function EmptyShelf() {
  return (
    <div style={{ position: "relative", zIndex: 2 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 16,
          paddingTop: 24,
        }}
      >
        <svg
          width="48"
          height="40"
          viewBox="0 0 48 40"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 8c4-4 12-4 20 0v28c-8-4-16-4-20 0V8z"
            fill="var(--color-card)"
            stroke="var(--color-brown-soft)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M44 8c-4-4-12-4-20 0v28c8-4 16-4 20 0V8z"
            fill="var(--color-card)"
            stroke="var(--color-brown-soft)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M24 8v28"
            stroke="var(--color-brown-soft)"
            strokeWidth="1.5"
          />
        </svg>
        <p
          style={{
            fontSize: 14,
            color: "var(--color-brown-soft)",
            marginTop: 12,
            wordBreak: "keep-all",
            textAlign: "center",
          }}
        >
          동화책을 만들면 여기 꽂혀요
        </p>
      </div>
      <ShelfBottom />
    </div>
  );
}

export default function MyLibraryClient({ newBookId }: MyLibraryClientProps) {
  const router = useRouter();
  const [books, setBooks] = useState<MyBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const clearedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/my-books");
        if (res.ok) {
          const data: MyBook[] = await res.json();
          setBooks(data);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // URL에서 ?new= 쿼리 제거 (새로고침 시 애니메이션 재실행 방지)
  useEffect(() => {
    if (newBookId && !clearedRef.current) {
      clearedRef.current = true;
      // 짧은 지연 후 쿼리 제거 (애니메이션 시작 후)
      const t = setTimeout(() => {
        router.replace("/my-library", { scroll: false });
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [newBookId, router]);

  return (
    <div
      style={{
        padding: "28px 0 80px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        minHeight: "calc(100dvh - 56px - 64px)",
        backgroundColor: "var(--color-beige)",
      }}
    >
      <div style={{ textAlign: "center", padding: "0 20px" }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--color-brown-soft)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          MY LIBRARY
        </p>
        <h1
          className="font-display"
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "var(--color-brown)",
            marginTop: 8,
            fontFamily: "var(--font-display)",
          }}
        >
          나의 서재
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "var(--color-brown-soft)",
            marginTop: 4,
          }}
        >
          {isLoading
            ? "불러오는 중..."
            : books.length > 0
            ? `내가 만든 동화책 ${books.length}권`
            : "아직 비어 있어요"}
        </p>
      </div>

      {/* 책장 */}
      <div
        style={{
          position: "relative",
          padding: "0 20px",
        }}
      >
        {books.length === 0 ? (
          <EmptyShelf />
        ) : (
          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                overflowX: "auto",
                paddingBottom: 8,
                WebkitOverflowScrolling: "touch",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-end",
                  padding: "20px 12px 4px",
                  minWidth: "max-content",
                }}
              >
                {books.map((book) => (
                  <LibraryBookCard
                    key={book.id}
                    book={book}
                    isNew={book.id === newBookId}
                    onClick={() => router.push(`/my-library/${book.id}`)}
                  />
                ))}
              </div>

              <div aria-hidden="true" style={{ ...SHELF_PLANK_STYLE, marginTop: 0 }} />
            </div>
            <div aria-hidden="true" style={SHELF_WALL_STYLE} />
          </div>
        )}
      </div>

      <div
        style={{
          textAlign: "center",
          paddingTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <a
          href="/create"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "14px 32px",
            borderRadius: 24,
            backgroundColor: "var(--color-brown)",
            color: "#fffdf8",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            textDecoration: "none",
            boxShadow:
              "0 6px 12px rgba(60,40,20,0.28), inset 0 -3px 5px rgba(0,0,0,0.18), inset 0 2px 4px rgba(255,255,255,0.18)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
        >
          <span style={{ fontWeight: 700, marginRight: 2 }}>+</span>
          새 동화책 만들기
        </a>

        <a
          href="/share/demo"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 22px",
            borderRadius: 24,
            border: "2px solid var(--color-brown)",
            color: "var(--color-brown)",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            textDecoration: "none",
            backgroundColor: "transparent",
          }}
        >
          공유 화면 보기 (데모)
        </a>
      </div>
    </div>
  );
}
