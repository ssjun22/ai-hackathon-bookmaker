"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center justify-between px-5 py-4"
      style={{
        backgroundColor: "var(--color-card)",
        boxShadow: "var(--shadow-felt-soft)",
      }}
    >
      {/* 아바타 + 인사 텍스트 */}
      <div className="flex items-center gap-3">
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "2px solid var(--color-green)",
          }}
        >
          <Image
            src="/toki/1.png"
            alt="토키 아바타"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
        <div>
          <p
            className="text-sm font-bold leading-tight"
            style={{ color: "var(--color-brown)" }}
          >
            안녕, 토끼야!
          </p>
          <p
            className="text-xs leading-tight"
            style={{ color: "var(--color-brown-soft)" }}
          >
            오늘은 어떤 이야기를 만들까?
          </p>
        </div>
      </div>

      {/* 알림 벨 */}
      <button
        className="relative flex items-center justify-center"
        style={{ width: 40, height: 40 }}
        aria-label="알림"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-brown-soft)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {/* 빨간 점 pulse */}
        <motion.span
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="absolute top-1 right-1"
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#FF4444",
            border: "1.5px solid var(--color-card)",
          }}
        />
      </button>
    </motion.header>
  );
}
