"use client";

import { motion } from "framer-motion";
import type { MyBook } from "@/lib/types";
import { displayTitle } from "@/lib/utils";

function formatDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("ko-KR")
    .replace(/\. /g, ".")
    .replace(/\.$/, "");
}

export function LibraryBookCard({
  book,
  isNew,
  onClick,
}: {
  book: MyBook;
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
      aria-label={`${displayTitle(book.storyTitle)} 읽기`}
      style={{
        position: "relative",
        zIndex: 2,
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
      {/* 표지 */}
      <div
        style={{
          width: 104,
          height: 144,
          borderRadius: "4px 10px 10px 4px",
          boxShadow:
            "4px 6px 12px rgba(60,40,20,0.32), 2px 2px 4px rgba(60,40,20,0.16), inset 3px 0 4px rgba(0,0,0,0.18), inset -1px 0 3px rgba(255,255,255,0.18)",
          border: "1px solid rgba(60,40,20,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: "#f1f5f9",
        }}
      >
        {book.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverImageUrl}
            alt={`${displayTitle(book.storyTitle)} 표지`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 44, lineHeight: 1, opacity: 0.9 }} aria-hidden="true">
            📖
          </span>
        )}
      </div>

      {/* 책 아래 그림자 */}
      <div
        aria-hidden="true"
        style={{
          width: 96,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "rgba(60,40,20,0.22)",
          marginTop: 6,
          filter: "blur(2px)",
        }}
      />

      {/* 제목 */}
      <p
        style={{
          width: 112,
          marginTop: 8,
          fontFamily: "var(--font-display)",
          fontSize: 13,
          fontWeight: 700,
          color: "var(--color-brown)",
          lineHeight: 1.3,
          textAlign: "center",
          wordBreak: "keep-all",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {displayTitle(book.storyTitle)}
      </p>

      {/* createdAt 날짜 라벨 */}
      <p
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "var(--color-brown-soft)",
          marginTop: 2,
          fontFamily: "var(--font-body)",
          letterSpacing: "0.02em",
        }}
      >
        {formatDate(book.createdAt)}
      </p>
    </motion.button>
  );
}
