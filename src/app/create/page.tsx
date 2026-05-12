"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import BookPicker from "@/components/BookPicker";
import ChatPanel from "@/components/ChatPanel";
import LoadingModal from "@/components/LoadingModal";
import { books } from "@/data/books";
import type { Book } from "@/data/books";

type Step = "pick" | "chat";

const slideVariants: Variants = {
  enterFromRight: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 28 } },
  exitToLeft: { x: -40, opacity: 0, transition: { duration: 0.18 } },
};

const slideVariantsReduced: Variants = {
  enterFromRight: { opacity: 0 },
  center: { opacity: 1 },
  exitToLeft: { opacity: 0 },
};

export default function CreatePage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState<Step>("pick");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleSelectBook(book: Book) {
    setSelectedBook(book);
    setStep("chat");
  }

  function handleChatComplete() {
    if (!selectedBook) return;
    setIsLoading(true);
    // 1.8~2.5초 가짜 대기 후 결과 페이지로 이동
    const delay = 1800 + Math.random() * 700;
    setTimeout(() => {
      router.push(`/create/result/${selectedBook.id}`);
    }, delay);
  }

  const variants = reduceMotion ? slideVariantsReduced : slideVariants;

  return (
    <>
      <main
        style={{
          minHeight: "calc(100dvh - 56px - 64px)", // Header + TabBar 제외
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--color-beige)",
          overflowX: "hidden",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {step === "pick" ? (
            <motion.div
              key="pick"
              variants={variants}
              initial="enterFromRight"
              animate="center"
              exit="exitToLeft"
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <BookPicker books={books} onSelect={handleSelectBook} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              variants={variants}
              initial="enterFromRight"
              animate="center"
              exit="exitToLeft"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "var(--color-beige-soft)",
                margin: "12px 12px 0",
                borderRadius: "var(--radius-clay) var(--radius-clay) 0 0",
                boxShadow: "var(--shadow-clay-sm)",
                border: "var(--border-clay)",
                borderBottom: "none",
                overflow: "hidden",
              }}
            >
              {selectedBook && (
                <ChatPanel book={selectedBook} onComplete={handleChatComplete} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 로딩 모달 — z-index 61, TabBar(z-30) 위 */}
      <LoadingModal open={isLoading} />
    </>
  );
}
