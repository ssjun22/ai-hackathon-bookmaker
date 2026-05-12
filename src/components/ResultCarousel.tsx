"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import type { StoryPage } from "@/data/mockResults";

interface ResultCarouselProps {
  storyTitle: string;
  pages: StoryPage[];
}

const SWIPE_THRESHOLD_PX = 60;
const SWIPE_VELOCITY = 400;

export default function ResultCarousel({ storyTitle, pages }: ResultCarouselProps) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const total = pages.length;

  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goNext = () => setActiveIndex((i) => Math.min(total - 1, i + 1));

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x < -SWIPE_THRESHOLD_PX || velocity.x < -SWIPE_VELOCITY) {
      goNext();
    } else if (offset.x > SWIPE_THRESHOLD_PX || velocity.x > SWIPE_VELOCITY) {
      goPrev();
    }
  };

  return (
    <div
      style={{
        padding: "20px 0 80px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        alignItems: "center",
      }}
    >
      {/* 헤더 */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ textAlign: "center", padding: "0 16px" }}
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

      {/* 인디케이터 */}
      <div
        role="tablist"
        aria-label="페이지 선택"
        style={{ display: "flex", gap: 6, justifyContent: "center" }}
      >
        {pages.map((page, idx) => (
          <button
            key={page.pageNumber}
            type="button"
            role="tab"
            aria-selected={idx === activeIndex}
            aria-label={`${idx + 1} 페이지로 이동`}
            onClick={() => setActiveIndex(idx)}
            style={{
              width: idx === activeIndex ? 18 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              padding: 0,
              backgroundColor:
                idx === activeIndex
                  ? "var(--color-brown)"
                  : "var(--color-brown-soft)",
              opacity: idx === activeIndex ? 1 : 0.4,
              cursor: "pointer",
              transition: "width 0.2s, opacity 0.2s",
            }}
          />
        ))}
      </div>

      {/* 캐러셀 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 440,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          touchAction: "pan-y",
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label="동화책 페이지"
      >
        {pages.map((page, idx) => {
          const offset = idx - activeIndex;
          const distance = Math.abs(offset);
          if (distance > 2) return null;

          // 위치 / 크기 / 투명도 / blur는 offset에 따라 분기
          const x = offset * 200;
          const scale = distance === 0 ? 1 : 0.78;
          const opacity = distance === 0 ? 1 : distance === 1 ? 0.5 : 0.18;
          const blur = distance === 0 ? 0 : distance === 1 ? 2.5 : 5;
          const zIndex = 10 - distance;

          return (
            <motion.div
              key={page.pageNumber}
              role="group"
              aria-roledescription="slide"
              aria-label={`${page.pageNumber} / ${total}: ${page.title}`}
              aria-hidden={distance !== 0}
              drag={distance === 0 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={handleDragEnd}
              animate={
                reduceMotion
                  ? { x, scale, opacity, filter: `blur(${blur}px)`, zIndex }
                  : { x, scale, opacity, filter: `blur(${blur}px)`, zIndex }
              }
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              style={{
                position: "absolute",
                width: 240,
                cursor: distance === 0 ? "grab" : "pointer",
                pointerEvents: distance > 1 ? "none" : "auto",
              }}
              onClick={() => {
                if (offset === 1) goNext();
                else if (offset === -1) goPrev();
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "var(--radius-clay)",
                  overflow: "hidden",
                  boxShadow:
                    distance === 0
                      ? "var(--shadow-clay)"
                      : "var(--shadow-clay-sm)",
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
                    fontSize: 80,
                  }}
                  aria-hidden="true"
                >
                  {page.emoji}
                </div>

                {/* 텍스트 영역 */}
                <div
                  style={{
                    padding: "14px 16px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <p
                    className="font-display"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--color-brown-soft)",
                      lineHeight: 1.2,
                    }}
                  >
                    {page.pageNumber}. {page.title}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--color-brown)",
                      lineHeight: 1.55,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {page.body}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* 좌우 화살표 */}
        <button
          type="button"
          onClick={goPrev}
          disabled={activeIndex === 0}
          aria-label="이전 페이지"
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            position: "absolute",
            left: 8,
            zIndex: 20,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "var(--border-clay)",
            backgroundColor: "var(--color-card)",
            color: "var(--color-brown)",
            fontSize: 18,
            fontWeight: 700,
            cursor: activeIndex === 0 ? "not-allowed" : "pointer",
            opacity: activeIndex === 0 ? 0.35 : 1,
            boxShadow: "var(--shadow-clay-sm)",
          }}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={activeIndex === total - 1}
          aria-label="다음 페이지"
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            position: "absolute",
            right: 8,
            zIndex: 20,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "var(--border-clay)",
            backgroundColor: "var(--color-card)",
            color: "var(--color-brown)",
            fontSize: 18,
            fontWeight: 700,
            cursor: activeIndex === total - 1 ? "not-allowed" : "pointer",
            opacity: activeIndex === total - 1 ? 0.35 : 1,
            boxShadow: "var(--shadow-clay-sm)",
          }}
        >
          ›
        </button>
      </div>

      {/* 하단 액션 */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        style={{ textAlign: "center", marginTop: 4 }}
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
