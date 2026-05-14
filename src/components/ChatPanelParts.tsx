"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- MicPermissionBanner ---

interface MicPermissionBannerProps {
  permissionDenied: boolean;
  onDismiss: () => void;
}

export function MicPermissionBanner({
  permissionDenied,
  onDismiss,
}: MicPermissionBannerProps) {
  return (
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
              onClick={onDismiss}
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
  );
}

// --- ChatInputRow ---

interface ChatVisuals {
  palette: {
    bg: string;
    titleColor?: string;
  };
}

interface ChatInputRowProps {
  inputValue: string;
  isAiThinking: boolean;
  isSupported: boolean;
  isListening: boolean;
  visuals: ChatVisuals;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onMicClick: () => void;
}

export function ChatInputRow({
  inputValue,
  isAiThinking,
  isSupported,
  isListening,
  visuals,
  inputRef,
  onInputChange,
  onKeyDown,
  onSend,
  onMicClick,
}: ChatInputRowProps) {
  return (
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
        onClick={onMicClick}
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
            ? visuals.palette.bg
            : "var(--color-card)",
          color: isListening
            ? visuals.palette.titleColor ?? "#fff"
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
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
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
          minWidth: 0,
        }}
        aria-label="대화 입력"
      />

      {/* 보내기 버튼 */}
      <button
        onClick={onSend}
        disabled={!inputValue.trim() || isAiThinking}
        aria-label="보내기"
        style={{
          width: 60,
          height: 44,
          borderRadius: 22,
          border: "var(--border-clay)",
          backgroundColor:
            inputValue.trim() && !isAiThinking
              ? visuals.palette.bg
              : "var(--color-card)",
          color:
            inputValue.trim() && !isAiThinking
              ? visuals.palette.titleColor ?? "#fff"
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
  );
}
