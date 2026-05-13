"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { listBooks } from "@/lib/myBookStorage";
import type { SavedBook } from "@/lib/myBookStorage";

interface MyLibraryClientProps {
  // 신규 저장된 bookId (URL ?new=... 에서 추출해 전달)
  newBookId: string | null;
}

function BookCard({
  book,
  isNew,
  onClick,
}: {
  book: SavedBook;
  isNew: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={isNew ? { y: -140, rotate: -10, opacity: 0 } : false}
      animate={{ y: 0, rotate: 0, opacity: 1 }}
      transition={
        isNew
          ? { type: "spring", stiffness: 200, damping: 22, delay: 0.15 }
          : undefined
      }
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.96 }}
      aria-label={`${book.storyTitle} 읽기`}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {/* 책 표지 */}
      <div
        style={{
          width: 90,
          height: 130,
          borderRadius: "6px 10px 10px 6px",
          background: `linear-gradient(135deg, ${book.colorPalette}dd 0%, ${book.colorPalette} 60%, ${book.colorPalette}aa 100%)`,
          boxShadow:
            "4px 0 10px rgba(60,40,20,0.3), -1px 0 3px rgba(255,255,255,0.15), inset 2px 0 4px rgba(255,255,255,0.2)",
          border: "1px solid rgba(60,40,20,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "8px 6px",
          overflow: "hidden",
        }}
      >
        <span style={{ fontSize: 32 }} aria-hidden="true">
          {book.coverEmoji}
        </span>
        <p
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            lineHeight: 1.3,
            wordBreak: "keep-all",
            textShadow: "0 1px 3px rgba(0,0,0,0.4)",
            fontFamily: "var(--font-display)",
            maxHeight: 52,
            overflow: "hidden",
          }}
        >
          {book.storyTitle}
        </p>
      </div>

      {/* 책 아래 그림자 */}
      <div
        aria-hidden="true"
        style={{
          width: 80,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "rgba(60,40,20,0.15)",
          marginTop: 4,
          filter: "blur(2px)",
        }}
      />
    </motion.button>
  );
}

export default function MyLibraryClient({ newBookId }: MyLibraryClientProps) {
  const router = useRouter();
  const [books, setBooks] = useState<SavedBook[]>([]);
  const clearedRef = useRef(false);

  useEffect(() => {
    setBooks(listBooks());
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
      {/* 헤더 */}
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
          My Library
        </p>
        <h1
          className="font-display"
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "var(--color-brown)",
            marginTop: 6,
          }}
        >
          📚 나의 서재
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "var(--color-brown-soft)",
            marginTop: 4,
          }}
        >
          {books.length > 0
            ? `${books.length}권의 책이 있어요`
            : "아직 저장된 책이 없어요"}
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
          /* 빈 서재 */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "48px 20px",
              borderRadius: "var(--radius-clay)",
              border: "2px dashed var(--color-brown-soft)",
              opacity: 0.5,
            }}
          >
            <span style={{ fontSize: 48 }}>📖</span>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-brown-soft)",
                textAlign: "center",
                wordBreak: "keep-all",
              }}
            >
              동화책을 만들고 저장하면 여기 나타나요!
            </p>
          </div>
        ) : (
          <div>
            {/* 책장 선반 영역 */}
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
                  padding: "20px 12px 0",
                  minWidth: "max-content",
                }}
              >
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    isNew={book.id === newBookId}
                    onClick={() => router.push(`/my-library/${book.id}`)}
                  />
                ))}
              </div>

              {/* 책장 선반 */}
              <div
                aria-hidden="true"
                style={{
                  height: 12,
                  background:
                    "linear-gradient(to bottom, #C8A876 0%, #A0804A 60%, #8B6B3A 100%)",
                  borderRadius: "0 0 4px 4px",
                  boxShadow: "0 4px 8px rgba(60,40,20,0.3)",
                  marginTop: 0,
                }}
              />
            </div>

            {/* 책장 선반 하단 벽 */}
            <div
              aria-hidden="true"
              style={{
                height: 24,
                background:
                  "linear-gradient(to bottom, #F5E8C8, #EDD9A3)",
                borderRadius: "0 0 8px 8px",
                boxShadow: "inset 0 -3px 6px rgba(60,40,20,0.1)",
              }}
            />
          </div>
        )}
      </div>

      {/* 새 책 만들기 링크 */}
      <div style={{ textAlign: "center", paddingTop: 8 }}>
        <a
          href="/create"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            borderRadius: 24,
            backgroundColor: "var(--color-brown)",
            color: "#fffdf8",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            textDecoration: "none",
            boxShadow: "var(--shadow-clay-sm)",
          }}
        >
          + 새 동화책 만들기
        </a>
      </div>
    </div>
  );
}
