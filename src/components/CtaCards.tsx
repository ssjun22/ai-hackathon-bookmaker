"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { y: 18, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

function BookIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      width={48}
      height={48}
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 2px 3px rgba(60,40,20,0.18))" }}
    >
      {/* 양면 책 - 펠트 펼친 책 */}
      <path
        d="M6,18 L32,24 L58,18 L58,52 L32,58 L6,52 Z"
        fill="#FFFBF0"
        stroke="#3D2E1E"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M32,24 L32,58" stroke="#3D2E1E" strokeWidth="2" />
      {/* 페이지 라인 */}
      <path
        d="M12,30 L26,33 M12,38 L26,40 M12,46 L24,47 M38,33 L52,30 M38,40 L52,38 M38,47 L50,46"
        stroke="#6B533A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      {/* 책갈피 */}
      <path
        d="M40,17 L40,30 L43,27 L46,30 L46,17"
        fill="#76B048"
        stroke="#3D2E1E"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      width={48}
      height={48}
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 2px 3px rgba(60,40,20,0.18))" }}
    >
      {/* 노트 */}
      <rect
        x="12"
        y="12"
        width="34"
        height="42"
        rx="4"
        fill="#FFFBF0"
        stroke="#3D2E1E"
        strokeWidth="2.5"
      />
      {/* 줄 */}
      <line x1="20" y1="22" x2="40" y2="22" stroke="#6B533A" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <line x1="20" y1="30" x2="40" y2="30" stroke="#6B533A" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <line x1="20" y1="38" x2="40" y2="38" stroke="#6B533A" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <line x1="20" y1="46" x2="34" y2="46" stroke="#6B533A" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      {/* 스파이럴 */}
      <circle cx="16" cy="18" r="2" fill="#3D2E1E" />
      <circle cx="16" cy="26" r="2" fill="#3D2E1E" />
      <circle cx="16" cy="34" r="2" fill="#3D2E1E" />
      <circle cx="16" cy="42" r="2" fill="#3D2E1E" />
      <circle cx="16" cy="50" r="2" fill="#3D2E1E" />
      {/* 연필 (대각선) */}
      <g transform="rotate(35 46 46)">
        <rect x="36" y="42" width="22" height="7" fill="#FF8C42" stroke="#3D2E1E" strokeWidth="1.8" />
        <rect x="56" y="42" width="3" height="7" fill="#F0B829" stroke="#3D2E1E" strokeWidth="1.8" />
        <polygon
          points="36,42 30,45.5 36,49"
          fill="#FFD9A5"
          stroke="#3D2E1E"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <polygon points="33,45.5 30,45.5 33,44 33,47" fill="#3D2E1E" />
      </g>
    </svg>
  );
}

const cards: {
  href: string;
  label: string;
  icon: ReactNode;
  bg: string;
  desc: string;
}[] = [
  {
    href: "/read",
    label: "책 읽기",
    icon: <BookIcon />,
    bg: "var(--color-green)",
    desc: "재미있는 이야기를\n같이 읽어봐요",
  },
  {
    href: "/create",
    label: "생각 만들기",
    icon: <NoteIcon />,
    bg: "var(--color-yellow)",
    desc: "나만의 이야기를\n만들어봐요",
  },
];

export default function CtaCards() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      variants={reduceMotion ? undefined : containerVariants}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
      className="px-5 py-5"
    >
      <div className="flex gap-3">
        {cards.map((card) => (
          <motion.div
            key={card.href}
            variants={reduceMotion ? undefined : cardVariants}
            whileTap={reduceMotion ? undefined : { scale: 0.93 }}
            className="flex-1"
          >
            <Link
              href={card.href}
              className="block h-full focus-visible:outline-none"
              style={{ textDecoration: "none" }}
              aria-label={card.label}
            >
              <div
                className="flex flex-col items-center justify-center text-center"
                style={{
                  backgroundColor: card.bg,
                  borderRadius: "var(--radius-clay)",
                  boxShadow: "var(--shadow-clay)",
                  border: "var(--border-clay)",
                  minHeight: 152,
                  padding: "20px 14px 18px",
                  color: "var(--color-brown)",
                }}
              >
                <div style={{ marginBottom: 8 }}>{card.icon}</div>
                <p
                  className="font-display font-bold leading-tight"
                  style={{ fontSize: 17, marginBottom: 4 }}
                >
                  {card.label}
                </p>
                <p
                  className="text-xs leading-snug whitespace-pre-line"
                  style={{ color: "var(--color-brown-soft)" }}
                >
                  {card.desc}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
