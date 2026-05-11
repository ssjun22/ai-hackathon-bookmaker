"use client";

import { motion } from "framer-motion";
import BookCover from "./BookCover";

const BOOKS = [
  {
    id: "star",
    title: "별이 된 아이",
    palette: { bg: "#3B5C8F", accent: "#F7D572" },
    motif: "star" as const,
  },
  {
    id: "forest",
    title: "숲 속의 비밀",
    palette: { bg: "#A8C97F", accent: "#6B533A" },
    motif: "forest" as const,
  },
  {
    id: "rabbit",
    title: "이상한 나라의 토끼",
    palette: { bg: "#F4B5C1", accent: "#FFFFFF" },
    motif: "rabbit" as const,
  },
  {
    id: "brave",
    title: "용감한 하루",
    palette: { bg: "#D9C44F", accent: "#8DB464" },
    motif: "carrot" as const,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function Bookshelf() {
  return (
    <section className="py-4">
      {/* 섹션 타이틀 */}
      <div className="px-5 mb-3 flex items-center justify-between">
        <h2
          className="text-base font-bold"
          style={{ color: "var(--color-brown)" }}
        >
          내 서재
        </h2>
        <button
          className="text-xs"
          style={{ color: "var(--color-brown-soft)" }}
        >
          전체보기
        </button>
      </div>

      {/* 가로 스크롤 책장 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex gap-3 overflow-x-auto scrollbar-hide px-5 pb-2"
      >
        {BOOKS.map((book) => (
          <motion.div
            key={book.id}
            variants={itemVariants}
            whileTap={{ scale: 0.96 }}
            style={{ flexShrink: 0 }}
          >
            <BookCover
              title={book.title}
              palette={book.palette}
              motif={book.motif}
              width={110}
              height={148}
            />
          </motion.div>
        ))}

        {/* 새로운 책 만들기 슬롯 */}
        <motion.div variants={itemVariants} style={{ flexShrink: 0 }}>
          <div
            style={{
              width: 110,
              height: 148,
              borderRadius: "var(--radius-felt-sm)",
              border: "2px dashed var(--color-brown-soft)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: 0.6,
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontSize: 28,
                color: "var(--color-brown-soft)",
                lineHeight: 1,
              }}
            >
              +
            </span>
            <p
              style={{
                fontSize: 10,
                color: "var(--color-brown-soft)",
                textAlign: "center",
                lineHeight: 1.3,
                padding: "0 8px",
              }}
            >
              새로운 책<br />만들기
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
