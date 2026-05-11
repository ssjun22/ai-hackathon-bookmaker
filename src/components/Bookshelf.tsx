"use client";

import { motion, useReducedMotion } from "framer-motion";
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
    palette: { bg: "#7FA84B", accent: "#3D2E1E" },
    motif: "forest" as const,
  },
  {
    id: "rabbit",
    title: "이상한 나라의 토끼",
    palette: { bg: "#EC9CAE", accent: "#FFFFFF" },
    motif: "rabbit" as const,
  },
  {
    id: "brave",
    title: "용감한 하루",
    palette: { bg: "#D9BC3E", accent: "#5C8240" },
    motif: "carrot" as const,
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { x: -16, opacity: 0 },
  show: { x: 0, opacity: 1 },
};

export default function Bookshelf() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="pt-2 pb-4">
      {/* 섹션 타이틀 */}
      <div className="px-5 mb-3 flex items-center justify-between">
        <h2
          className="font-display font-bold"
          style={{ color: "var(--color-brown)", fontSize: 18 }}
        >
          내 서재
        </h2>
        <button
          type="button"
          className="text-xs focus-visible:outline-none"
          style={{
            color: "var(--color-brown-soft)",
            padding: "8px 10px",
            minHeight: 32,
          }}
        >
          전체보기 ›
        </button>
      </div>

      {/* 가로 스크롤 책장 */}
      <motion.div
        variants={reduceMotion ? undefined : containerVariants}
        initial={reduceMotion ? false : "hidden"}
        animate={reduceMotion ? undefined : "show"}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-5 pb-2 pt-1"
      >
        {BOOKS.map((book) => (
          <motion.div
            key={book.id}
            variants={reduceMotion ? undefined : itemVariants}
            whileTap={reduceMotion ? undefined : { scale: 0.93, y: 2 }}
            style={{ flexShrink: 0 }}
          >
            <BookCover
              title={book.title}
              palette={book.palette}
              motif={book.motif}
              width={112}
              height={150}
            />
          </motion.div>
        ))}

        {/* 새로운 책 만들기 슬롯 */}
        <motion.div
          variants={reduceMotion ? undefined : itemVariants}
          whileTap={reduceMotion ? undefined : { scale: 0.95 }}
          style={{ flexShrink: 0 }}
        >
          <div
            style={{
              width: 112,
              height: 150,
              borderRadius: "var(--radius-clay-sm)",
              border: "2.5px dashed rgba(120,90,50,0.40)",
              backgroundColor: "rgba(255,251,240,0.6)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "var(--color-green)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-clay-sm)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 5v14M5 12h14" stroke="#FFFBF0" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <p
              className="font-display"
              style={{
                fontSize: 11,
                fontWeight: 700,
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
