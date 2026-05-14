"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { MyBook } from "@/lib/types";
import { SavedBookCard, CreateSlot } from "@/components/BookshelfCards";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};

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
          boxShadow: "var(--shadow-clay-sm)",
          border: "var(--border-clay)",
          padding: "22px 0 0",
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
              fontSize: 18,
              lineHeight: 1.2,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <h2 style={{ margin: 0 }}>내 서재</h2>
          </Link>
          <Link
            href="/my-library"
            className="text-xs focus-visible:outline-none"
            style={{
              color: "var(--color-brown-soft)",
              padding: "8px 12px",
              marginRight: -12,
              minHeight: 32,
              fontWeight: 600,
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

          {mounted && books.length === 0 && (
            <p
              style={{
                marginTop: 12,
                paddingLeft: 24,
                paddingRight: 24,
                fontSize: 12,
                color: "var(--color-brown-soft)",
                fontFamily: "var(--font-body)",
              }}
            >
              아직 만든 책이 없어요. 첫 번째 동화책을 만들어 보세요!
            </p>
          )}

          <div
            aria-hidden="true"
            style={{
              position: "relative",
              height: 14,
              marginTop: 16,
              background:
                "linear-gradient(to bottom, #C49563 0%, #A87B4B 45%, #8C6238 100%)",
              boxShadow:
                "0 3px 6px rgba(60,40,20,0.20), inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -2px 3px rgba(60,40,20,0.18)",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              height: 18,
              background:
                "linear-gradient(to bottom, rgba(60,40,20,0.10) 0%, rgba(60,40,20,0) 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
