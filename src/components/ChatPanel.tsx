"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useSpeechInput } from "@/hooks/useSpeechInput";
import type { Book } from "@/data/books";

// 책별 2~3턴 mock 시나리오
const SCENARIOS: Record<string, string[]> = {
  star: [
    "냄새 맡은 값 이야기에서 어떤 장면이 가장 기억에 남았나요?",
    "원님의 판결을 보고 어떤 생각이 들었나요?",
    "욕심 없이 공평한 세상을 만들려면 어떻게 해야 할까요?",
  ],
  forest: [
    "마법 맷돌 이야기를 읽으면서 어떤 감정을 느꼈나요?",
    "욕심쟁이 선장의 행동에서 무엇을 배울 수 있었나요?",
    "우리 삶에서 '멈출 수 없는 욕심'은 어떤 것이 있을까요?",
  ],
  rabbit: [
    "농부가 무를 원님께 드린 마음이 어떤 것이었을까요?",
    "욕심쟁이 부자가 무를 받게 된 결과를 어떻게 생각하나요?",
    "진심 어린 선물과 대가를 바라는 선물, 어떤 차이가 있을까요?",
  ],
  brave: [
    "소금장수와 기름장수가 다리 위에서 마주쳤을 때 어떤 생각을 했을까요?",
    "노인의 지혜가 두 사람에게 어떤 변화를 가져다주었나요?",
    "양보와 배려가 우리 삶을 어떻게 바꿀 수 있을까요?",
  ],
};

const DEFAULT_SCENARIO = [
  "이 책에서 가장 인상 깊었던 장면은 무엇인가요?",
  "주인공의 행동에서 무엇을 배울 수 있었나요?",
  "이 이야기가 나에게 주는 교훈은 무엇인가요?",
];

export type ChatMessage = {
  role: "ai" | "user";
  text: string;
};

interface ChatPanelProps {
  book: Book;
  onComplete: () => void;
}

const msgVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22 } },
};

export default function ChatPanel({ book, onComplete }: ChatPanelProps) {
  const reduceMotion = useReducedMotion();
  const scenario = SCENARIOS[book.id] ?? DEFAULT_SCENARIO;

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", text: scenario[0] },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [turn, setTurn] = useState(0); // 현재 사용자가 응답해야 할 턴 인덱스
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isSupported, isListening, transcript, start, stop, reset, error } =
    useSpeechInput();

  // transcript가 확정되면 input에 채움
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
      reset();
    }
  }, [transcript, reset]);

  // 음성 에러 처리
  useEffect(() => {
    if (error === "not-allowed") {
      setPermissionDenied(true);
    }
  }, [error]);

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiThinking]);

  function handleSend() {
    const text = inputValue.trim();
    if (!text || isAiThinking) return;

    const userMessage: ChatMessage = { role: "user", text };
    const nextTurn = turn + 1;

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    if (nextTurn >= scenario.length) {
      // 마지막 턴 — 잠시 후 onComplete 호출
      setIsAiThinking(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: "고마워요! 이제 당신만의 동화책을 만들어 드릴게요 ✨" },
        ]);
        setIsAiThinking(false);
        setTimeout(() => onComplete(), 800);
      }, 700);
    } else {
      // 다음 AI 질문
      setIsAiThinking(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: scenario[nextTurn] },
        ]);
        setIsAiThinking(false);
      }, 700);
      setTurn(nextTurn);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleMicClick() {
    if (!isSupported) return;
    setPermissionDenied(false);
    if (isListening) {
      stop();
    } else {
      start();
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      {/* 책 제목 헤더 */}
      <div
        style={{
          padding: "16px 20px 12px",
          borderBottom: "1px solid rgba(120,90,50,0.10)",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--color-brown-soft)",
            letterSpacing: "0.05em",
          }}
        >
          선택한 책
        </p>
        <p
          className="font-display"
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "var(--color-brown)",
            marginTop: 2,
          }}
        >
          {book.title}
        </p>
        <p
          style={{
            fontSize: 12,
            color: "var(--color-brown-soft)",
            marginTop: 4,
          }}
        >
          {turn + 1} / {scenario.length} 번째 질문
        </p>
      </div>

      {/* 마이크 권한 거부 안내 배너 */}
      <AnimatePresence>
        {permissionDenied && (
          <motion.div
            key="mic-denied"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden", flexShrink: 0 }}
          >
            <div
              role="alert"
              style={{
                backgroundColor: "#FEF3C7",
                borderBottom: "1px solid rgba(234,179,8,0.3)",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.4 }}>
                🎙️ 마이크를 허용하면 말로 대답할 수 있어요.
                <br />
                주소창 옆 자물쇠 → 마이크 허용을 눌러주세요.
              </p>
              <button
                onClick={() => setPermissionDenied(false)}
                style={{
                  fontSize: 11,
                  color: "#92400E",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                  padding: "4px 8px",
                  borderRadius: 6,
                  backgroundColor: "rgba(234,179,8,0.2)",
                }}
              >
                닫기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 메시지 목록 */}
      <div
        className="scrollbar-hide"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 16px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              variants={reduceMotion ? undefined : msgVariants}
              initial="hidden"
              animate="show"
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius:
                    msg.role === "user"
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                  backgroundColor:
                    msg.role === "user"
                      ? book.palette.bg
                      : "var(--color-card)",
                  color:
                    msg.role === "user"
                      ? book.palette.titleColor ?? "#fff"
                      : "var(--color-brown)",
                  boxShadow: "var(--shadow-clay-sm)",
                  fontSize: 14,
                  lineHeight: 1.55,
                  fontFamily: "var(--font-body)",
                  wordBreak: "keep-all",
                }}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* AI 타이핑 인디케이터 */}
        {isAiThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "flex", justifyContent: "flex-start" }}
          >
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "18px 18px 18px 4px",
                backgroundColor: "var(--color-card)",
                boxShadow: "var(--shadow-clay-sm)",
                display: "flex",
                gap: 4,
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "var(--color-brown-soft)",
                    display: "inline-block",
                    animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 행 */}
      <div
        style={{
          padding: "10px 12px 16px",
          borderTop: "1px solid rgba(120,90,50,0.10)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* 마이크 버튼 */}
        <button
          onClick={handleMicClick}
          disabled={!isSupported}
          aria-label={
            !isSupported
              ? "이 브라우저는 음성 입력을 지원하지 않아요"
              : isListening
                ? "음성 인식 중지"
                : "말하기"
          }
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "var(--border-clay)",
            backgroundColor: isListening
              ? book.palette.bg
              : "var(--color-card)",
            color: isListening
              ? book.palette.titleColor ?? "#fff"
              : "var(--color-brown-soft)",
            cursor: isSupported ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            opacity: isSupported ? 1 : 0.4,
            boxShadow: "var(--shadow-clay-sm)",
            transition: "background-color 0.2s, color 0.2s",
          }}
        >
          {isListening ? (
            // 인식 중 — 정지 아이콘
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="4" height="10" rx="1" fill="currentColor" />
              <rect x="9" y="3" width="4" height="10" rx="1" fill="currentColor" />
            </svg>
          ) : (
            // 마이크 아이콘
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="5" y="1" width="6" height="8" rx="3" fill="currentColor" />
              <path d="M2 7C2 10.3137 4.68629 13 8 13C11.3137 13 14 10.3137 14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>

        {/* 텍스트 입력 */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "듣고 있어요..." : "생각을 입력해 보세요"}
          disabled={isAiThinking}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 22,
            border: "var(--border-clay)",
            backgroundColor: "var(--color-card)",
            padding: "0 16px",
            fontSize: 14,
            color: "var(--color-brown)",
            fontFamily: "var(--font-body)",
            outline: "none",
            boxShadow: "var(--shadow-clay-sm)",
            minWidth: 0, // flex-1이 좁아지도록
          }}
          aria-label="대화 입력"
        />

        {/* 보내기 버튼 */}
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isAiThinking}
          aria-label="보내기"
          style={{
            width: 60,
            height: 44,
            borderRadius: 22,
            border: "var(--border-clay)",
            backgroundColor:
              inputValue.trim() && !isAiThinking
                ? book.palette.bg
                : "var(--color-card)",
            color:
              inputValue.trim() && !isAiThinking
                ? book.palette.titleColor ?? "#fff"
                : "var(--color-brown-soft)",
            cursor: inputValue.trim() && !isAiThinking ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            opacity: inputValue.trim() && !isAiThinking ? 1 : 0.45,
            boxShadow: "var(--shadow-clay-sm)",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "var(--font-body)",
            transition: "background-color 0.2s, color 0.2s, opacity 0.2s",
          }}
        >
          전송
        </button>
      </div>

      {/* 타이핑 바운스 애니메이션 + focus-visible */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        button:focus-visible {
          outline: 2px solid var(--color-brown);
          outline-offset: 2px;
        }
        input:focus-visible {
          outline: 2px solid var(--color-brown);
          outline-offset: 0;
        }
      `}</style>
    </div>
  );
}
