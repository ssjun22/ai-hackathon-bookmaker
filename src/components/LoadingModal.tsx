"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";

interface LoadingModalProps {
  open: boolean;
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants: Variants = {
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

const panelVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function LoadingModal({ open }: LoadingModalProps) {
  const reduceMotion = useReducedMotion();

  // 모달 열릴 때 body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 백드롭 */}
          <motion.div
            key="loading-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.22 }}
            aria-hidden="true"
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(30,20,10,0.70)",
              zIndex: 60,
            }}
          />

          {/* 센터링 wrapper */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 61,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {/* 패널 */}
            <motion.div
              key="loading-panel"
              variants={reduceMotion ? panelVariantsReduced : panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="status"
              aria-live="polite"
              aria-label="동화책을 만들고 있어요"
              style={{
                width: "min(320px, calc(100vw - 48px))",
                backgroundColor: "#fffdf8",
                borderRadius: "var(--radius-clay)",
                boxShadow:
                  "0 32px 64px rgba(60,40,20,0.30), 0 8px 24px rgba(60,40,20,0.18), inset 0 1px 0 rgba(255,255,255,0.85)",
                border: "1.5px solid rgba(120,90,50,0.12)",
                padding: "36px 28px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                pointerEvents: "auto",
              }}
            >
              {/* 스피너 */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  border: "4px solid rgba(120,90,50,0.12)",
                  borderTopColor: "var(--color-brown)",
                  animation: "spin 0.9s linear infinite",
                }}
                aria-hidden="true"
              />

              {/* 텍스트 */}
              <div style={{ textAlign: "center" }}>
                <p
                  className="font-display"
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--color-brown)",
                    lineHeight: 1.3,
                  }}
                >
                  동화책을 만들고 있어요
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--color-brown-soft)",
                    marginTop: 8,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  잠시만 기다려 주세요 ✨
                </p>
              </div>
            </motion.div>
          </div>

          {/* 스피너 키프레임 */}
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
