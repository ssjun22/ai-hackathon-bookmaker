"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import BookSpine from "./BookSpine";
import BookReaderModal from "./BookReaderModal";
import type { Book } from "@/lib/types";
import { getBookVisuals } from "@/lib/bookVisuals";

interface BookWithContent extends Book {
  content: string;
}

interface LibraryClientProps {
  booksWithContent: BookWithContent[];
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 280, damping: 24 } },
};

export default function LibraryClient({ booksWithContent }: LibraryClientProps) {
  const [selectedBook, setSelectedBook] = useState<BookWithContent | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <>
      {/* 페이지 헤더 */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -12 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          paddingTop: 28,
          paddingBottom: 16,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <h1
          className="font-display"
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "var(--color-brown)",
            lineHeight: 1.2,
          }}
        >
          나의 서재
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "var(--color-brown-soft)",
            marginTop: 6,
            fontFamily: "var(--font-body)",
          }}
        >
          읽고 싶은 책을 골라보세요
        </p>
      </motion.div>

      {/* 책꽂이 컨테이너 */}
      <div
        style={{
          marginLeft: 16,
          marginRight: 16,
          borderRadius: "var(--radius-clay)",
          backgroundColor: "var(--color-beige-soft)",
          boxShadow: "var(--shadow-clay-sm)",
          border: "var(--border-clay)",
          overflow: "hidden",
          paddingTop: 20,
        }}
      >
        {/* 책들 가로 스크롤 영역 */}
        <motion.div
          variants={reduceMotion ? undefined : containerVariants}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? undefined : "show"}
          className="overflow-x-auto scrollbar-hide"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 12,
            paddingTop: 16,
            paddingLeft: 24,
            paddingRight: 24,
            paddingBottom: 0,
            scrollSnapType: "x mandatory",
          }}
        >
          {booksWithContent.map((book) => {
            const visuals = getBookVisuals(book.id);
            return (
              <motion.div
                key={book.id}
                variants={reduceMotion ? undefined : itemVariants}
                style={{
                  scrollSnapAlign: "start",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                <BookSpine
                  title={book.title}
                  spineImage={visuals.spineImage}
                  onClick={() => setSelectedBook(book)}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* 나무 선반 */}
        <div
          aria-hidden="true"
          style={{
            height: 16,
            marginTop: 2,
            background:
              "linear-gradient(to bottom, #C49563 0%, #A87B4B 45%, #8C6238 100%)",
            boxShadow:
              "0 4px 8px rgba(60,40,20,0.22), inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(60,40,20,0.18)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            height: 20,
            background:
              "linear-gradient(to bottom, rgba(60,40,20,0.10) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* 힌트 텍스트 */}
      <p
        style={{
          textAlign: "center",
          fontSize: 15,
          color: "var(--color-brown-soft)",
          marginTop: 18,
          fontFamily: "var(--font-body)",
          opacity: 0.75,
        }}
      >
        책을 클릭하면 바로 읽을 수 있어요
      </p>

      {/* 모달 */}
      <BookReaderModal
        book={selectedBook}
        content={selectedBook?.content ?? ""}
        open={selectedBook !== null}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
