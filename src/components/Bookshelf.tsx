"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { MyBook } from "@/lib/types";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { x: -16, opacity: 0 },
  show: { x: 0, opacity: 1 },
};

function displayTitle(title: string): string {
  return title.replace(/\s*[—–-]\s*나의\s*동화\s*$/u, "");
}

function SavedBookCard({
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
            boxShadow:
              "4px 6px 12px rgba(60,40,20,0.32), 2px 2px 4px rgba(60,40,20,0.16), inset 3px 0 4px rgba(0,0,0,0.18), inset -1px 0 3px rgba(255,255,255,0.18)",
            border: "1px solid rgba(60,40,20,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            backgroundColor: "#f1f5f9",
          }}
        >
          {book.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.coverImageUrl}
              alt={`${displayTitle(book.storyTitle)} 표지`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: 40, lineHeight: 1, opacity: 0.9 }} aria-hidden="true">
              📖
            </span>
          )}
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

function CreateSlot({ reduceMotion }: { reduceMotion: boolean | null }) {
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
              fontSize: 13,
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

export default function Bookshelf() {
  const reduceMotion = useReducedMotion();
  const [books, setBooks] = useState<MyBook[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/my-books");
        if (res.ok) {
          const data: MyBook[] = await res.json();
          setBooks(data);
        }
      } finally {
        setMounted(true);
      }
    })();
  }, []);

  return (
    <section
      className="pt-2 pb-6"
      style={{ marginBottom: 16, paddingLeft: 16, paddingRight: 16 }}
    >
      <div
        style={{
          backgroundColor: "var(--color-beige-soft)",
          borderRadius: "var(--radius-clay)",
          padding: "22px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="mb-4 flex items-baseline justify-between"
          style={{ paddingLeft: 24, paddingRight: 24 }}
        >
          <Link
            href="/my-library"
            className="font-display focus-visible:outline-none"
            style={{
              color: "var(--color-brown)",
              fontSize: 22,
              lineHeight: 1.2,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <h2 style={{ margin: 0 }}>내가 만든 책</h2>
          </Link>
          <Link
            href="/my-library"
            className="focus-visible:outline-none"
            style={{
              color: "var(--color-brown-soft)",
              padding: "8px 12px",
              marginRight: -12,
              minHeight: 32,
              fontWeight: 600,
              fontSize: 14,
              lineHeight: 1.2,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            전체 보기 ›
          </Link>
        </div>

        <div style={{ position: "relative" }}>
          <motion.div
            variants={reduceMotion ? undefined : containerVariants}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "show"}
            className="flex gap-3 overflow-x-auto scrollbar-hide pt-1"
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 0,
              position: "relative",
              zIndex: 1,
              alignItems: "flex-start",
            }}
          >
            {mounted &&
              books.map((book) => (
                <SavedBookCard
                  key={book.id}
                  book={book}
                  reduceMotion={reduceMotion}
                />
              ))}
            <CreateSlot reduceMotion={reduceMotion} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
