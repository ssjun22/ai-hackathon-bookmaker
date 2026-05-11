"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function Header() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={reduceMotion ? false : { y: -12, opacity: 0 }}
      animate={reduceMotion ? undefined : { y: 0, opacity: 1 }}
      transition={reduceMotion ? undefined : { duration: 0.4, ease: "easeOut" }}
      className="flex items-center justify-between px-5"
      style={{
        backgroundColor: "var(--color-card)",
        boxShadow: "var(--shadow-clay-sm)",
        paddingTop: "calc(14px + env(safe-area-inset-top))",
        paddingBottom: 14,
        borderBottomLeftRadius: "var(--radius-clay)",
        borderBottomRightRadius: "var(--radius-clay)",
      }}
    >
      {/* 아바타 + 인사 텍스트 */}
      <div className="flex items-center gap-3">
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "3px solid var(--color-green)",
            boxShadow: "0 2px 6px rgba(120,90,50,0.18)",
          }}
        >
          <Image
            src="/toki/1.png"
            alt="토키 아바타"
            fill
            sizes="48px"
            className="object-cover object-top"
            priority
          />
        </div>
        <div>
          <p
            className="font-display text-base font-bold leading-tight"
            style={{ color: "var(--color-brown)" }}
          >
            안녕, 토끼야!
          </p>
          <p
            className="text-xs leading-tight"
            style={{ color: "var(--color-brown-soft)", marginTop: 2 }}
          >
            오늘은 어떤 이야기를 만들까?
          </p>
        </div>
      </div>

      {/* 알림 벨 */}
      <button
        type="button"
        className="relative flex items-center justify-center focus-visible:outline-none"
        style={{
          minWidth: 44,
          minHeight: 44,
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: "var(--color-card)",
          boxShadow: "var(--shadow-clay-sm)",
          border: "var(--border-clay)",
        }}
        aria-label="알림 보기"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-brown)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {/* 빨간 점 pulse */}
        <motion.span
          animate={reduceMotion ? undefined : { opacity: [0.7, 1, 0.7], scale: [1, 1.15, 1] }}
          transition={reduceMotion ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
          style={{
            top: 8,
            right: 8,
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "#FF4444",
            border: "2px solid var(--color-card)",
          }}
          aria-hidden="true"
        />
      </button>
    </motion.header>
  );
}
