"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { Book } from "@/lib/types";

interface BookPickerProps {
  books: Book[];
  onSelect: (book: Book) => void;
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
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
      {/* 펼친 책 이미지 — 중앙 */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        style={{ marginBottom: 14 }}
      >
        <Image
          src="/ui/openbook.png"
          alt="펼친 책"
          width={240}
          height={196}
          style={{ width: 240, height: "auto", display: "block" }}
          priority
        />
      </motion.div>

      {/* 안내 문구 */}
      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{
          fontSize: 17,
          color: "var(--color-brown-soft)",
          textAlign: "center",
          marginBottom: 22,
          fontFamily: "var(--font-body)",
          fontWeight: 600,
        }}
      >
        이미 읽은 책 중에서 골라보세요
      </motion.p>

      {/* 책 제목 버튼 — 2×2 그리드 */}
      <motion.div
        variants={reduceMotion ? undefined : containerVariants}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
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
            whileHover={reduceMotion ? undefined : { y: -2 }}
            aria-label={`${book.title} 선택`}
            className="font-display focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              padding: "20px 14px",
              backgroundColor: "var(--color-card)",
              borderRadius: "var(--radius-clay-sm)",
              boxShadow: "var(--shadow-clay-sm)",
              border: "var(--border-clay)",
              cursor: "pointer",
              userSelect: "none",
              minHeight: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "var(--color-brown)",
                lineHeight: 1.35,
                wordBreak: "keep-all",
              }}
            >
              {book.title}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
