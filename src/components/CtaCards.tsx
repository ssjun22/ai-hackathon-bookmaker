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

function FeltFilter({ id }: { id: string }) {
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.85"
        numOctaves="2"
        stitchTiles="stitch"
        result="noise"
      />
      <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
      <feComponentTransfer in="grayNoise" result="alphaNoise">
        <feFuncA type="linear" slope="0.35" intercept="0" />
      </feComponentTransfer>
      <feComposite in="alphaNoise" in2="SourceGraphic" operator="in" result="textured" />
      <feBlend in="SourceGraphic" in2="textured" mode="multiply" />
    </filter>
  );
}

function BookIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      width={64}
      height={64}
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 3px 4px rgba(60,40,20,0.22))" }}
    >
      <defs>
        <FeltFilter id="felt-book" />
        <linearGradient id="page-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFEF6" />
          <stop offset="100%" stopColor="#F2E6C6" />
        </linearGradient>
        <linearGradient id="cover-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4F7A6B" />
          <stop offset="100%" stopColor="#365E51" />
        </linearGradient>
      </defs>

      <g filter="url(#felt-book)">
        {/* 책 표지 (뒤쪽 청록 면) — 살짝 두께감 */}
        <path
          d="M6,22 L40,28 L74,22 L74,60 L40,66 L6,60 Z"
          fill="url(#cover-grad)"
          stroke="#2A4A40"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* 책 페이지 (앞쪽 크림 면) */}
        <path
          d="M9,25 L40,31 L71,25 L71,57 L40,63 L9,57 Z"
          fill="url(#page-grad)"
          stroke="#3D2E1E"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* 가운데 접힘선 */}
        <path d="M40,31 L40,63" stroke="#3D2E1E" strokeWidth="2" opacity="0.85" />
        {/* 페이지 줄 */}
        <path
          d="M15,37 L34,40 M15,44 L34,46 M15,51 L32,52 M46,40 L65,37 M46,46 L65,44 M46,52 L63,51"
          stroke="#6B533A"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* 책갈피 */}
        <path
          d="M50,21 L50,36 L53.5,32.5 L57,36 L57,21 Z"
          fill="#D85F4A"
          stroke="#3D2E1E"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      width={64}
      height={64}
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 3px 4px rgba(60,40,20,0.22))" }}
    >
      <defs>
        <FeltFilter id="felt-note" />
        <linearGradient id="paper-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFCE8" />
          <stop offset="100%" stopColor="#F2E2A8" />
        </linearGradient>
        <linearGradient id="pencil-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF9D5C" />
          <stop offset="100%" stopColor="#E36E2A" />
        </linearGradient>
      </defs>

      <g filter="url(#felt-note)">
        {/* 노트 본체 */}
        <rect
          x="14"
          y="14"
          width="42"
          height="52"
          rx="5"
          fill="url(#paper-grad)"
          stroke="#3D2E1E"
          strokeWidth="2.5"
        />
        {/* 줄 */}
        <line x1="24" y1="28" x2="50" y2="28" stroke="#6B533A" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
        <line x1="24" y1="36" x2="50" y2="36" stroke="#6B533A" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
        <line x1="24" y1="44" x2="50" y2="44" stroke="#6B533A" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
        <line x1="24" y1="52" x2="42" y2="52" stroke="#6B533A" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
        {/* 스파이럴 (왼쪽) */}
        <circle cx="18" cy="20" r="2.4" fill="#2B2014" stroke="#3D2E1E" strokeWidth="0.8" />
        <circle cx="18" cy="30" r="2.4" fill="#2B2014" stroke="#3D2E1E" strokeWidth="0.8" />
        <circle cx="18" cy="40" r="2.4" fill="#2B2014" stroke="#3D2E1E" strokeWidth="0.8" />
        <circle cx="18" cy="50" r="2.4" fill="#2B2014" stroke="#3D2E1E" strokeWidth="0.8" />
        <circle cx="18" cy="60" r="2.4" fill="#2B2014" stroke="#3D2E1E" strokeWidth="0.8" />
        {/* 연필 (대각선, 오른쪽 아래에서 위로) */}
        <g transform="rotate(40 56 56)">
          <rect
            x="40"
            y="52"
            width="28"
            height="9"
            fill="url(#pencil-grad)"
            stroke="#3D2E1E"
            strokeWidth="2"
            rx="1"
          />
          {/* 지우개 부분 */}
          <rect x="66" y="52" width="4.5" height="9" fill="#F0B829" stroke="#3D2E1E" strokeWidth="2" />
          {/* 연필 끝 (나무 + 심) */}
          <polygon
            points="40,52 32,56.5 40,61"
            fill="#FFD9A5"
            stroke="#3D2E1E"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <polygon points="36,56.5 32,56.5 36,54.5 36,58.5" fill="#2B2014" />
        </g>
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
    desc: "재미있는 이야기를 읽어요",
  },
  {
    href: "/create",
    label: "생각 만들기",
    icon: <NoteIcon />,
    bg: "var(--color-yellow)",
    desc: "내 생각으로 이야기를 만들어요",
  },
];

export default function CtaCards() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      variants={reduceMotion ? undefined : containerVariants}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
      className="py-5"
      style={{ marginBottom: 20, marginLeft: 16, marginRight: 16 }}
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
                  minHeight: 168,
                  padding: "22px 14px 18px",
                  color: "var(--color-brown)",
                }}
              >
                <div style={{ marginBottom: 10 }}>{card.icon}</div>
                <p
                  className="font-display leading-tight"
                  style={{ fontSize: 17, marginBottom: 4, fontWeight: 700 }}
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
