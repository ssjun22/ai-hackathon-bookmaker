"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const PHRASES = [
  "안녕! 오늘은 뭐 읽을까?",
  "재미있는 책이 가득해~",
  "같이 이야기 만들어볼래?",
  "어떤 책이 제일 좋아?",
  "오늘도 멋진 하루야!",
];

const INTERVAL_MS = 3800;

export default function RabbitSpeech() {
  const reduceMotion = useReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % PHRASES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 28,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={
            reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: -6 }
          }
          animate={
            reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }
          }
          exit={
            reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -4 }
          }
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 22,
            duration: 0.35,
          }}
          style={{
            position: "relative",
            background: "#FFFBF0",
            color: "var(--color-brown)",
            padding: "10px 18px",
            borderRadius: 22,
            fontFamily: "var(--font-display)",
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1.25,
            whiteSpace: "nowrap",
            boxShadow:
              "0 6px 14px rgba(60,40,20,0.18), 0 2px 4px rgba(60,40,20,0.10)",
            border: "1.5px solid rgba(120,90,50,0.14)",
          }}
        >
          {PHRASES[idx]}
          {/* 말풍선 꼬리 — 아래쪽 가운데 */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: 14,
              height: 14,
              background: "#FFFBF0",
              borderRight: "1.5px solid rgba(120,90,50,0.14)",
              borderBottom: "1.5px solid rgba(120,90,50,0.14)",
              borderBottomRightRadius: 4,
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
