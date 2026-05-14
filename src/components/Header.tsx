"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function Header() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={reduceMotion ? false : { y: -12, opacity: 0 }}
      animate={reduceMotion ? undefined : { y: 0, opacity: 1 }}
      transition={reduceMotion ? undefined : { duration: 0.4, ease: "easeOut" }}
      className="flex items-center justify-between"
      style={{
        backgroundColor: "transparent",
        paddingTop: "calc(14px + env(safe-area-inset-top))",
        paddingBottom: 14,
        paddingLeft: 24,
        paddingRight: 24,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "1.5px solid rgba(120,90,50,0.18)",
            boxShadow: "0 2px 6px rgba(120,90,50,0.14)",
            backgroundColor: "var(--color-card)",
          }}
        >
          <Image
            src="/ui/profile.png"
            alt="프로필"
            fill
            sizes="48px"
            className="object-cover object-center"
            priority
          />
        </div>
        <div>
          <p
            className="font-display leading-tight"
            style={{
              color: "var(--color-brown)",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            안녕 대교야
          </p>
          <p
            className="leading-tight"
            style={{
              color: "var(--color-brown-soft)",
              marginTop: 3,
              fontSize: 14,
            }}
          >
            오늘은 어떤 이야기를 만들까?
          </p>
        </div>
      </div>

      <Link
        href="/"
        aria-label="홈으로"
        className="flex items-center justify-center focus-visible:outline-none"
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: "var(--color-card)",
          color: "var(--color-brown)",
          flexShrink: 0,
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 11l9-8 9 8" />
          <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
        </svg>
      </Link>
    </motion.header>
  );
}
