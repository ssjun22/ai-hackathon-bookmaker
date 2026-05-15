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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  async function handleChatComplete(answers: ChatAnswer[]) {
    if (!selectedBook) return;
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/my-books/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: selectedBook.id, answers }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          (errData as { error?: string }).error ?? `서버 오류 (${res.status})`
        );
      }

      const data = await res.json() as { id: string };
      router.push(`/create/result/${data.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했어요.";
      setIsLoading(false);
      setErrorMessage(message);
    }
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
                position: "fixed",
                inset: 0,
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "var(--color-beige-soft)",
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

      {/* 에러 메시지 (생성 실패 시) */}
      {errorMessage && !isLoading && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 62,
            background: "var(--color-card)",
            border: "1.5px solid #E57373",
            borderRadius: "var(--radius-clay)",
            boxShadow: "var(--shadow-clay)",
            padding: "12px 20px",
            maxWidth: 360,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ color: "#E57373", fontSize: 18 }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: "var(--color-brown)", fontSize: 13, fontWeight: 600, margin: 0 }}>
              책 만들기에 실패했어요
            </p>
            <p style={{ color: "var(--color-brown-soft)", fontSize: 12, margin: "2px 0 0" }}>
              {errorMessage}
            </p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            aria-label="오류 닫기"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-brown-soft)",
              fontSize: 16,
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
