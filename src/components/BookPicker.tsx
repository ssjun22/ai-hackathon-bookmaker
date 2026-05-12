"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import BookCover from "./BookCover";
import type { Book } from "@/data/books";

interface BookPickerProps {
  books: Book[];
  onSelect: (book: Book) => void;
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 24 },
  },
};

export default function BookPicker({ books, onSelect }: BookPickerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: "24px 16px 32px",
      }}
    >
      {/* 상단 카피 */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ textAlign: "center", marginBottom: 28 }}
      >
        <h2
          className="font-display"
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--color-brown)",
            lineHeight: 1.3,
          }}
        >
          생각 만들기
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--color-brown-soft)",
            marginTop: 6,
            fontFamily: "var(--font-body)",
          }}
        >
          이미 읽은 책 중에서 골라보세요
        </p>
      </motion.div>

      {/* 2×2 그리드 */}
      <motion.div
        variants={reduceMotion ? undefined : containerVariants}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          width: "100%",
          maxWidth: 380,
        }}
      >
        {books.map((book) => (
          <motion.button
            key={book.id}
            variants={reduceMotion ? undefined : itemVariants}
            onClick={() => onSelect(book)}
            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "16px 12px",
              backgroundColor: "var(--color-card)",
              borderRadius: "var(--radius-clay)",
              boxShadow: "var(--shadow-clay-sm)",
              border: "var(--border-clay)",
              cursor: "pointer",
              userSelect: "none",
            }}
            aria-label={`${book.title} 선택`}
          >
            {/* 책 표지 */}
            <BookCover
              title={book.title}
              palette={book.palette}
              motif={book.motif}
              width={90}
              height={120}
            />
            {/* 책 제목 */}
            <p
              className="font-display"
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--color-brown)",
                textAlign: "center",
                lineHeight: 1.35,
                wordBreak: "keep-all",
              }}
            >
              {book.title}
            </p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
