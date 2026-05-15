"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { Book } from "@/lib/types";
import { getBookVisuals } from "@/lib/bookVisuals";

interface BookReaderModalProps {
  book: Book | null;
  content: string;
  open: boolean;
  onClose: () => void;
}

type Sentence = { text: string; start: number };

function splitSentences(text: string): Sentence[] {
  const out: Sentence[] = [];
  const re = /[^.!?\n]+(?:[.!?]+|\n+|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m[0].length === 0) {
      re.lastIndex++;
      continue;
    }
    out.push({ text: m[0], start: m.index });
  }
  return out.length > 0 ? out : [{ text, start: 0 }];
}

export default function BookReaderModal({
  book,
  content,
  open,
  onClose,
}: BookReaderModalProps) {
  const reduceMotion = useReducedMotion();
  const visuals = book ? getBookVisuals(book.id) : null;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [activeSentence, setActiveSentence] = useState<number | null>(null);

  // 본문을 문장 단위로 쪼개 시작 인덱스를 보존
  const sentences = useMemo(() => splitSentences(content), [content]);

  // 각 문장의 누적 글자 수 — 글자 수 비례 sync 용
  const cumChars = useMemo(() => {
    const acc: number[] = [];
    let sum = 0;
    for (const s of sentences) {
      sum += s.text.length;
      acc.push(sum);
    }
    return acc;
  }, [sentences]);
  const totalChars = cumChars[cumChars.length - 1] ?? 1;

  function findSentenceAtCharIndex(charIndex: number): number {
    for (let i = sentences.length - 1; i >= 0; i--) {
      if (charIndex >= sentences[i].start) return i;
    }
    return 0;
  }

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

  function stopAll() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsReading(false);
    setActiveSentence(null);
  }

  // 모달 닫히거나 책 바뀌면 음성/오디오 정지
  useEffect(() => {
    if (open) return;
    stopAll();
  }, [open, book?.id]);

  function toggleRead() {
    if (typeof window === "undefined") return;
    if (isReading) {
      stopAll();
      return;
    }
    stopAll();

    // 1순위: 녹음 파일 재생 — 글자 수 비례 매핑 + 살짝 lag로 자연스럽게 sync
    if (visuals?.audioFile) {
      const audio = new Audio(visuals.audioFile);
      audio.playbackRate = 1.0;
      const HIGHLIGHT_LAG_RATIO = 0.4; // 형광펜을 많이 느리게 — 초반 2~3문장만 sync 맞춤
      const handleTimeUpdate = () => {
        if (!audio.duration || !isFinite(audio.duration)) return;
        const ratio = (audio.currentTime / audio.duration) * HIGHLIGHT_LAG_RATIO;
        const targetChars = ratio * totalChars;
        // cumChars[i]는 sentence i까지의 누적 글자수. targetChars가
        // 어느 문장 안에 들어가는지 찾는다.
        let idx = 0;
        for (let i = 0; i < cumChars.length; i++) {
          if (targetChars < cumChars[i]) {
            idx = i;
            break;
          }
          idx = i;
        }
        setActiveSentence(idx);
      };
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.onended = () => {
        setActiveSentence(sentences.length - 1);
        setIsReading(false);
      };
      audio.onerror = () => {
        setIsReading(false);
        setActiveSentence(null);
      };
      audio.play().catch(() => {
        setIsReading(false);
        setActiveSentence(null);
      });
      audioRef.current = audio;
      setIsReading(true);
      setActiveSentence(0);
      return;
    }

    // 2순위: 브라우저 TTS — onboundary로 정확 sync
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(content);
    utter.lang = "ko-KR";
    utter.rate = 0.9;
    utter.pitch = 1.05;
    const voices = synth.getVoices();
    const koVoice =
      voices.find((v) => /yuna/i.test(v.name) && v.lang.startsWith("ko")) ??
      voices.find((v) => v.lang.startsWith("ko"));
    if (koVoice) utter.voice = koVoice;
    utter.onboundary = (e: SpeechSynthesisEvent) => {
      setActiveSentence(findSentenceAtCharIndex(e.charIndex));
    };
    utter.onend = () => {
      setIsReading(false);
      setActiveSentence(null);
    };
    utter.onerror = () => {
      setIsReading(false);
      setActiveSentence(null);
    };
    synth.speak(utter);
    setIsReading(true);
    setActiveSentence(0);
  }

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 340, damping: 30 },
        },
        exit: {
          opacity: 0,
          y: 16,
          transition: { duration: 0.2 },
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

          {/* 모달 센터링 wrapper — 풀스크린 */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 51,
              display: "flex",
              pointerEvents: "none",
            }}
          >
            {/* 모달 컨테이너 — 풀스크린 book-spread dialog (모바일 stack / PC 좌우) */}
            <motion.div
              key={`modal-${book.id}`}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label={`${book.title} 읽기`}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col md:flex-row"
              style={{
                width: "100%",
                height: "100dvh",
                backgroundColor: "#fffdf8",
                overflow: "hidden",
                pointerEvents: "auto",
                position: "relative",
              }}
            >
              {/* 이미지 영역 — 모바일 상단, PC 좌측 */}
              {visuals?.bannerImage && (
                <div
                  className="relative w-full h-[42vh] md:h-full md:w-auto md:flex-1"
                  style={{
                    backgroundColor: "rgba(244,213,163,0.20)",
                    minWidth: 0,
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={visuals.bannerImage}
                    alt={book.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                    priority
                  />

                  {/* 플로팅 CTA — 이미지 영역 우상단 */}
                  <Link
                    href={`/create?book=${book.id}`}
                    onClick={onClose}
                    className="absolute z-[5] top-4 right-4 md:top-6 md:right-6 md:!text-[19px] md:px-7 md:py-4"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      padding: "12px 22px",
                      backgroundColor: "var(--color-brown)",
                      color: "#FFFBF0",
                      fontFamily: "var(--font-display)",
                      fontSize: 16,
                      fontWeight: 700,
                      borderRadius: 999,
                      boxShadow:
                        "0 14px 28px rgba(60,40,20,0.40), 0 6px 10px rgba(60,40,20,0.25)",
                      textDecoration: "none",
                    }}
                  >
                    나만의 책 만들기
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              )}

              {/* 책 가운데 접힘선 — PC에서만 표시 */}
              {visuals?.bannerImage && (
                <div
                  aria-hidden="true"
                  className="hidden md:block"
                  style={{
                    width: 1,
                    background:
                      "linear-gradient(to bottom, transparent 0%, rgba(60,40,20,0.10) 15%, rgba(60,40,20,0.10) 85%, transparent 100%)",
                    flexShrink: 0,
                  }}
                />
              )}

              {/* 텍스트 영역 — 모바일 하단, PC 우측 */}
              <div
                className="flex-1"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  position: "relative",
                }}
              >
                {/* 우측 페이지 상단 — 타이틀 + 우측 상단 버튼들 */}
                <div
                  style={{
                    padding: "28px 32px 18px",
                    borderBottom: "1px solid rgba(120,90,50,0.10)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--color-brown-soft)",
                        letterSpacing: "0.06em",
                        marginBottom: 6,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {book.author}
                    </p>
                    <h2
                      className="font-display"
                      style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: "var(--color-brown)",
                        lineHeight: 1.25,
                      }}
                    >
                      {book.title}
                    </h2>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {/* 책 읽어주기 (TTS) */}
                    <button
                      type="button"
                      onClick={toggleRead}
                      aria-label="책 읽어주기"
                      aria-pressed={isReading}
                      title={isReading ? "읽기 멈추기" : "책 읽어주기"}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: "1.5px solid rgba(120,90,50,0.18)",
                        backgroundColor: isReading
                          ? "var(--color-yellow)"
                          : "rgba(244,213,163,0.40)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--color-brown)",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 14v-2a9 9 0 1 1 18 0v2" />
                        <path d="M3 14h3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Z" />
                        <path d="M21 14h-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6Z" />
                      </svg>
                    </button>

                    {/* 닫기 */}
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
                </div>

                {/* 본문 스크롤 영역 */}
                <div
                  className="scrollbar-hide"
                  style={{
                    overflowY: "auto",
                    flex: 1,
                    padding: "28px 32px 110px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-gowun), var(--font-pretendard), serif",
                      fontSize: 22,
                      lineHeight: 2.05,
                      color: "var(--color-brown)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "keep-all",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {sentences.map((s, i) => (
                      <span
                        key={`${s.start}-${i}`}
                        style={{
                          backgroundColor:
                            i === activeSentence
                              ? "rgba(247,213,114,0.6)"
                              : "transparent",
                          borderRadius: 4,
                          transition: "background-color 0.25s ease",
                          boxShadow:
                            i === activeSentence
                              ? "0 0 0 2px rgba(247,213,114,0.6)"
                              : undefined,
                        }}
                      >
                        {s.text}
                      </span>
                    ))}
                  </p>
                </div>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
