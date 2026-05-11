"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import BookCover from "./BookCover";
import { books } from "@/data/books";

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
    <section className="pt-2 pb-6" style={{ marginBottom: 16, paddingLeft: 16, paddingRight: 16 }}>
      {/* 책장 카드 컨테이너 */}
      <div
        style={{
          backgroundColor: "var(--color-beige-soft)",
          borderRadius: "var(--radius-clay)",
          boxShadow: "var(--shadow-clay-sm)",
          border: "var(--border-clay)",
          padding: "22px 0 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 섹션 타이틀 */}
        <div
          className="mb-4 flex items-baseline justify-between"
          style={{ paddingLeft: 24, paddingRight: 24 }}
        >
          <h2
            className="font-display"
            style={{ color: "var(--color-brown)", fontSize: 18, lineHeight: 1.2, fontWeight: 700 }}
          >
            내 서재
          </h2>
          <Link
            href="/library"
            className="text-xs focus-visible:outline-none"
            style={{
              color: "var(--color-brown-soft)",
              padding: "8px 12px",
              marginRight: -12,
              minHeight: 32,
              fontWeight: 600,
              lineHeight: 1.2,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            전체 보기 ›
          </Link>
        </div>

        {/* 책 + 선반 영역 */}
        <div style={{ position: "relative" }}>
          {/* 가로 스크롤 책장 */}
          <motion.div
            variants={reduceMotion ? undefined : containerVariants}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "show"}
            className="flex gap-3 overflow-x-auto scrollbar-hide pt-1"
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 0,
              position: "relative",
              zIndex: 1,
            }}
          >
            {books.map((book) => (
              <motion.div
                key={book.id}
                variants={reduceMotion ? undefined : itemVariants}
                whileTap={reduceMotion ? undefined : { scale: 0.93, y: 2 }}
                style={{ flexShrink: 0, position: "relative" }}
              >
                <Link href="/library" style={{ display: "block", textDecoration: "none" }}>
                  <BookCover
                    title={book.title}
                    palette={book.palette}
                    motif={book.motif}
                    width={112}
                    height={150}
                  />
                </Link>
                {/* 책 하단 컨택트 섀도우 — 선반 위에 놓인 느낌 */}
                <div
                  style={{
                    position: "absolute",
                    left: 6,
                    right: 6,
                    bottom: -4,
                    height: 10,
                    background:
                      "radial-gradient(ellipse at center, rgba(60,40,20,0.35) 0%, rgba(60,40,20,0) 70%)",
                    pointerEvents: "none",
                    zIndex: -1,
                  }}
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
                  backgroundColor: "rgba(244,229,195,0.45)",
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

          {/* 나무 선반 판자 */}
          <div
            aria-hidden="true"
            style={{
              position: "relative",
              height: 14,
              marginTop: -2,
              background:
                "linear-gradient(to bottom, #C49563 0%, #A87B4B 45%, #8C6238 100%)",
              boxShadow:
                "0 3px 6px rgba(60,40,20,0.20), inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -2px 3px rgba(60,40,20,0.18)",
            }}
          />
          {/* 선반 아래 그림자 / 마감 */}
          <div
            aria-hidden="true"
            style={{
              height: 18,
              background:
                "linear-gradient(to bottom, rgba(60,40,20,0.10) 0%, rgba(60,40,20,0) 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
