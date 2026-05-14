"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { MyBook } from "@/lib/types";
import { displayTitle } from "@/lib/utils";

export const itemVariants = {
  hidden: { x: -16, opacity: 0 },
  show: { x: 0, opacity: 1 },
};

export function SavedBookCard({
  book,
  reduceMotion,
}: {
  book: MyBook;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.div
      variants={reduceMotion ? undefined : itemVariants}
      whileTap={reduceMotion ? undefined : { scale: 0.93, y: 2 }}
      style={{ flexShrink: 0, position: "relative" }}
    >
      <Link
        href={`/my-library/${book.id}`}
        style={{
          display: "block",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div
          style={{
            width: 96,
            height: 134,
            borderRadius: "4px 10px 10px 4px",
            background: `linear-gradient(135deg, ${book.colorPalette}dd 0%, ${book.colorPalette} 60%, ${book.colorPalette}aa 100%)`,
            boxShadow:
              "4px 6px 12px rgba(60,40,20,0.32), 2px 2px 4px rgba(60,40,20,0.16), inset 3px 0 4px rgba(0,0,0,0.18), inset -1px 0 3px rgba(255,255,255,0.18)",
            border: "1px solid rgba(60,40,20,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <span
            style={{ fontSize: 40, lineHeight: 1, opacity: 0.9 }}
            aria-hidden="true"
          >
            {book.coverEmoji}
          </span>
        </div>
        <p
          style={{
            width: 104,
            marginTop: 8,
            fontFamily: "var(--font-display)",
            fontSize: 12,
            fontWeight: 700,
            color: "var(--color-brown)",
            lineHeight: 1.3,
            textAlign: "center",
            wordBreak: "keep-all",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {displayTitle(book.storyTitle)}
        </p>
      </Link>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 4,
          right: 12,
          top: 130,
          height: 8,
          background:
            "radial-gradient(ellipse at center, rgba(60,40,20,0.35) 0%, rgba(60,40,20,0) 70%)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
    </motion.div>
  );
}

export function CreateSlot({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.div
      variants={reduceMotion ? undefined : itemVariants}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      style={{ flexShrink: 0 }}
    >
      <Link
        href="/create"
        style={{ display: "block", textDecoration: "none" }}
        aria-label="새로운 동화책 만들기"
      >
        <div
          style={{
            width: 96,
            height: 134,
            borderRadius: "4px 10px 10px 4px",
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
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="#FFFBF0"
                strokeWidth="3"
                strokeLinecap="round"
              />
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
      </Link>
    </motion.div>
  );
}
