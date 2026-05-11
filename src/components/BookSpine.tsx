"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Palette } from "@/data/books";

interface BookSpineProps {
  title: string;
  author: string;
  palette: Palette;
  ribbonColor: string;
  onClick?: () => void;
  layoutId?: string;
}

export default function BookSpine({
  title,
  author,
  palette,
  ribbonColor,
  onClick,
  layoutId,
}: BookSpineProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      layoutId={layoutId}
      onClick={onClick}
      whileHover={reduceMotion ? undefined : { y: -8, transition: { duration: 0.2 } }}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      aria-label={`${title} 읽기`}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-600"
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
        borderRadius: 6,
      }}
    >
      {/* 책갈피 리본 — 책 상단 위로 살짝 튀어나옴 */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -10,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          filter: "drop-shadow(0 2px 3px rgba(60,40,20,0.30))",
        }}
      >
        <svg
          width="14"
          height="30"
          viewBox="0 0 14 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 리본 본체 — V자 cutout */}
          <path
            d="M0,0 L14,0 L14,24 L7,19 L0,24 Z"
            fill={ribbonColor}
          />
        </svg>
      </div>

      {/* 책등 본체 */}
      <div
        style={{
          width: 60,
          height: 260,
          borderRadius: "6px 6px 4px 4px",
          background: `linear-gradient(to right, ${palette.bg}cc 0%, ${palette.bg} 30%, ${palette.bg} 70%, ${palette.bg}aa 100%)`,
          boxShadow:
            "3px 0 8px rgba(60,40,20,0.28), -1px 0 3px rgba(255,255,255,0.18), inset 2px 0 4px rgba(255,255,255,0.22), inset -2px 0 4px rgba(0,0,0,0.10)",
          border: "1px solid rgba(60,40,20,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* 책등 왼쪽 가죽 느낌 테두리 선 */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 6,
            top: 16,
            bottom: 16,
            width: 2,
            borderRadius: 2,
            background: `rgba(255,255,255,0.18)`,
          }}
        />
        {/* 세로 제목 텍스트 */}
        <p
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            color: palette.titleColor ?? "#FFFBF0",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            lineHeight: 1.3,
            letterSpacing: "0.05em",
            textShadow: "0 1px 3px rgba(0,0,0,0.35)",
            padding: "20px 0",
            maxHeight: 200,
            overflow: "hidden",
            wordBreak: "keep-all",
          }}
        >
          {title}
        </p>
        {/* 저자 세로 텍스트 (하단) */}
        <p
          style={{
            position: "absolute",
            bottom: 12,
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            color: palette.titleColor
              ? `${palette.titleColor}99`
              : "rgba(255,251,240,0.55)",
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: "0.04em",
            fontFamily: "var(--font-body)",
          }}
        >
          {author}
        </p>
      </div>
    </motion.button>
  );
}
