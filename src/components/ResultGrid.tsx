"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { StoryPage } from "@/data/mockResults";

interface ResultGridProps {
  storyTitle: string;
  pages: StoryPage[];
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};

export default function ResultGrid({ storyTitle, pages }: ResultGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      style={{
        padding: "20px 16px 80px", // 하단 TabBar 여백 확보
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* 헤더 */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ textAlign: "center" }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--color-brown-soft)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          나만의 동화책 완성!
        </p>
        <h1
          className="font-display"
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--color-brown)",
            marginTop: 6,
            lineHeight: 1.3,
            wordBreak: "keep-all",
          }}
        >
          {storyTitle}
        </h1>
      </motion.div>

      {/* 3×2 그리드 */}
      <motion.div
        variants={reduceMotion ? undefined : containerVariants}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
        role="list"
        aria-label="동화책 페이지 목록"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
        }}
      >
        {pages.map((page) => (
          <motion.div
            key={page.pageNumber}
            role="listitem"
            variants={reduceMotion ? undefined : cardVariants}
            style={{
              display: "flex",
              flexDirection: "column",
              borderRadius: "var(--radius-clay-sm)",
              overflow: "hidden",
              boxShadow: "var(--shadow-clay-sm)",
              border: "var(--border-clay)",
              backgroundColor: "var(--color-card)",
            }}
          >
            {/* 컬러 패널 (이미지 자리) */}
            <div
              style={{
                backgroundColor: page.colorPalette,
                aspectRatio: "3 / 4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
              aria-hidden="true"
            >
              {page.emoji}
            </div>

            {/* 텍스트 영역 */}
            <div
              style={{
                padding: "8px 8px 10px",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <p
                className="font-display"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--color-brown-soft)",
                  lineHeight: 1.2,
                }}
              >
                {page.pageNumber}. {page.title}
              </p>
              <p
                style={{
                  fontSize: 9,
                  color: "var(--color-brown)",
                  lineHeight: 1.45,
                  fontFamily: "var(--font-body)",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {page.body}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 하단 액션 */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        style={{ textAlign: "center" }}
      >
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
          다른 책으로 만들기
        </a>
      </motion.div>
    </div>
  );
}
