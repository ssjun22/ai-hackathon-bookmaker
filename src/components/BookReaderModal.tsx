"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Book } from "@/data/books";

interface BookReaderModalProps {
  book: Book | null;
  content: string;
  open: boolean;
  onClose: () => void;
}

export default function BookReaderModal({
  book,
  content,
  open,
  onClose,
}: BookReaderModalProps) {
  const reduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // ESC 키 닫힘
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // 모달 열릴 때 X 버튼에 포커스
  useEffect(() => {
    if (open) {
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
  }, [open]);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { opacity: 0, scale: 0.88, y: 24 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { type: "spring", stiffness: 340, damping: 28 },
        },
        exit: {
          opacity: 0,
          scale: 0.92,
          y: 16,
          transition: { duration: 0.18 },
        },
      };

  return (
    <AnimatePresence>
      {open && book && (
        <>
          {/* 백드롭 */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.22 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(30,20,10,0.62)",
              zIndex: 50,
            }}
            aria-hidden="true"
          />

          {/* 모달 컨테이너 */}
          <motion.div
            key={`modal-${book.id}`}
            layoutId={reduceMotion ? undefined : `book-spine-${book.id}`}
            variants={reduceMotion ? modalVariants : undefined}
            initial={reduceMotion ? "hidden" : { opacity: 0, scale: 0.88, y: 24 }}
            animate={reduceMotion ? "visible" : { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 340, damping: 28 } }}
            exit={reduceMotion ? "exit" : { opacity: 0, scale: 0.92, y: 16, transition: { duration: 0.18 } }}
            role="dialog"
            aria-modal="true"
            aria-label={`${book.title} 읽기`}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 51,
              width: "min(680px, 92vw)",
              maxHeight: "88dvh",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fffdf8",
              borderRadius: 24,
              boxShadow:
                "0 32px 64px rgba(60,40,20,0.30), 0 8px 24px rgba(60,40,20,0.18), inset 0 1px 0 rgba(255,255,255,0.85)",
              border: "1.5px solid rgba(120,90,50,0.12)",
              overflow: "hidden",
            }}
          >
            {/* 모달 헤더 */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: "20px 24px 16px",
                borderBottom: "1px solid rgba(120,90,50,0.10)",
                flexShrink: 0,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--color-brown-soft)",
                    letterSpacing: "0.06em",
                    marginBottom: 4,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {book.author}
                </p>
                <h2
                  className="font-display"
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--color-brown)",
                    lineHeight: 1.25,
                  }}
                >
                  {book.title}
                </h2>
              </div>

              {/* 닫기 버튼 */}
              <button
                ref={closeButtonRef}
                onClick={onClose}
                aria-label="닫기"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1.5px solid rgba(120,90,50,0.18)",
                  backgroundColor: "rgba(244,213,163,0.40)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                  color: "var(--color-brown-soft)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M1 1L13 13M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* 본문 스크롤 영역 */}
            <div
              style={{
                overflowY: "auto",
                flex: 1,
                padding: "28px 32px 40px",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-gowun), var(--font-pretendard), serif",
                  fontSize: 18,
                  lineHeight: 1.95,
                  color: "var(--color-brown)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "keep-all",
                }}
              >
                {content}
              </p>
            </div>

            {/* 하단 장식 선 */}
            <div
              aria-hidden="true"
              style={{
                height: 4,
                background: `linear-gradient(to right, ${book.palette.bg}88, ${book.ribbonColor}88, ${book.palette.bg}88)`,
                flexShrink: 0,
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
