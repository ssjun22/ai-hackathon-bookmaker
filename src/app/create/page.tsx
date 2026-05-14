"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import BookPicker from "@/components/BookPicker";
import ChatPanel from "@/components/ChatPanel";
import LoadingModal from "@/components/LoadingModal";
import type { Book, ChatAnswer } from "@/lib/types";
import { registeredBookIds } from "@/lib/bookVisuals";

type Step = "pick" | "chat";

const LOADING_BASE_MS = 1800;
const LOADING_JITTER_MS = 700;

const STATIC_BOOK_META: Record<string, { title: string; author: string }> = {
  star: { title: "냄새 맡은 값", author: "전래동화" },
  forest: { title: "소금을 만드는 맷돌", author: "전래동화" },
  rabbit: { title: "송아지와 바꾼 무", author: "전래동화" },
  brave: { title: "소금장수와 기름장수", author: "전래동화" },
};

function buildStaticBooks(): Book[] {
  return registeredBookIds().map((id) => ({
    id,
    title: STATIC_BOOK_META[id]?.title ?? id,
    author: STATIC_BOOK_META[id]?.author ?? "",
    summary: "",
  }));
}

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
  const [books, setBooks] = useState<Book[]>(() => buildStaticBooks());

  // URL의 ?book=xxx 가 있으면 picker 건너뛰고 바로 chat 스텝으로 진입
  useEffect(() => {
    const bookId = new URLSearchParams(window.location.search).get("book");
    if (!bookId) return;
    const found = buildStaticBooks().find((b) => b.id === bookId);
    if (found) {
      setSelectedBook(found);
      setStep("chat");
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/books");
        if (res.ok) {
          const data: Book[] = await res.json();
          if (data.length > 0) {
            setBooks(data);
          }
        }
      } catch {
        // 네트워크 실패 시에도 static fallback 유지
      }
    })();
  }, []);

  function handleSelectBook(book: Book) {
    setSelectedBook(book);
    setStep("chat");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleChatComplete(_answers: ChatAnswer[]) {
    if (!selectedBook) return;
    setIsLoading(true);
    // 1.8~2.5초 가짜 대기 후 결과 페이지로 이동 (T4에서 실제 API 호출로 교체)
    const delay = LOADING_BASE_MS + Math.random() * LOADING_JITTER_MS;
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
