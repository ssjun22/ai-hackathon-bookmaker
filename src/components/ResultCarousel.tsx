"use client";

import {
  useState,
  useCallback,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import type { StoryPage, MyBookPage } from "@/lib/types";

interface ResultCarouselProps {
  storyTitle: string;
  pages: StoryPage[];
}

const SWIPE_THRESHOLD_PX = 60;
const SWIPE_VELOCITY = 400;

const REGEN_PALETTES = [
  "#E07A5F", "#3D405B", "#81B29A", "#F2CC8F",
  "#118AB2", "#06D6A0", "#FFD166", "#EF476F",
];
const REGEN_EMOJIS = [
  "✨", "🌈", "🎨", "🌸", "🍀", "🦋", "🎭", "🌟",
  "🎪", "🌺", "🦄", "🎠", "🌻", "🎋", "🍁",
];

function nextPalette(current: string): string {
  const idx = REGEN_PALETTES.indexOf(current);
  return REGEN_PALETTES[(idx + 1) % REGEN_PALETTES.length];
}

function nextEmoji(current: string): string {
  const idx = REGEN_EMOJIS.indexOf(current);
  if (idx < 0) return REGEN_EMOJIS[0];
  return REGEN_EMOJIS[(idx + 1) % REGEN_EMOJIS.length];
}

type EditState = {
  body: string;          // 칩(원래·AI) 선택 결과 — textarea가 비어있을 때 사용
  customInput: string;   // textarea 직접 입력값 (초기 빈 문자열)
  colorPalette: string;
  emoji: string;
  dirty: boolean;
  regenerating: boolean;
  isEditing: boolean;
};

// textarea 우선, 비어있으면 body
function effectiveBody(s: EditState): string {
  return s.customInput.trim().length > 0 ? s.customInput : s.body;
}

export default function ResultCarousel({ storyTitle, pages }: ResultCarouselProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const total = pages.length;

  const [isSaving, setIsSaving] = useState(false);
  const [editStates, setEditStates] = useState<EditState[]>(
    pages.map((p) => ({
      body: p.body,
      customInput: "",
      colorPalette: p.colorPalette,
      emoji: p.emoji,
      dirty: false,
      regenerating: false,
      isEditing: false,
    }))
  );

  // await 후에도 최신 editStates를 읽기 위한 ref
  const editStatesRef = useRef(editStates);
  editStatesRef.current = editStates;

  // 원본과 동일한 후보는 "원래 문장" 박스와 중복되므로 제외
  const aiCandidatesByPage = useMemo(
    () =>
      pages.map((p) =>
        (p.bodyCandidates ?? []).filter((c) => c !== p.body)
      ),
    [pages]
  );

  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goNext = () => setActiveIndex((i) => Math.min(total - 1, i + 1));

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x < -SWIPE_THRESHOLD_PX || velocity.x < -SWIPE_VELOCITY) {
      goNext();
    } else if (offset.x > SWIPE_THRESHOLD_PX || velocity.x > SWIPE_VELOCITY) {
      goPrev();
    }
  };

  const toggleCardEdit = useCallback((idx: number) => {
    setEditStates((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, isEditing: !s.isEditing } : s))
    );
  }, []);

  const updateCustomInput = useCallback(
    (idx: number, value: string) => {
      setEditStates((prev) =>
        prev.map((s, i) => {
          if (i !== idx) return s;
          const next = { ...s, customInput: value };
          const original = pages[i].body;
          next.dirty = effectiveBody(next) !== original;
          return next;
        })
      );
    },
    [pages]
  );

  const pickCandidate = useCallback(
    (idx: number, candidate: string) => {
      setEditStates((prev) =>
        prev.map((s, i) =>
          i === idx
            ? {
                ...s,
                body: candidate,
                customInput: "",
                dirty: candidate !== pages[i].body,
              }
            : s
        )
      );
    },
    [pages]
  );

  const resetCardBody = useCallback((idx: number, originalBody: string) => {
    setEditStates((prev) =>
      prev.map((s, i) =>
        i === idx
          ? {
              ...s,
              body: originalBody,
              customInput: "",
              dirty: false,
            }
          : s
      )
    );
  }, []);

  const regenDirty = useCallback(async () => {
    let dirtyIndices: number[] = [];
    setEditStates((prev) => {
      dirtyIndices = prev.map((s, i) => (s.dirty ? i : -1)).filter((i) => i >= 0);
      if (dirtyIndices.length === 0) return prev;
      const next = prev.map((s, i) =>
        dirtyIndices.includes(i) ? { ...s, regenerating: true } : s
      );
      editStatesRef.current = next;
      return next;
    });

    if (dirtyIndices.length === 0) return;

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setEditStates((prev) => {
      const next = prev.map((s, i) =>
        dirtyIndices.includes(i)
          ? {
              ...s,
              regenerating: false,
              dirty: false,
              colorPalette: nextPalette(s.colorPalette),
              emoji: nextEmoji(s.emoji),
            }
          : s
      );
      editStatesRef.current = next;
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const hasDirtyNow = editStatesRef.current.some((s) => s.dirty);
      if (hasDirtyNow) {
        await regenDirty();
      }

      const latest = editStatesRef.current;
      const savedPages: MyBookPage[] = pages.map((p, i) => ({
        pageNumber: p.pageNumber,
        title: p.title,
        body: effectiveBody(latest[i]),
        colorPalette: latest[i].colorPalette,
        emoji: latest[i].emoji,
        imageUrl: p.imageUrl,
      }));

      const res = await fetch("/api/my-books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyTitle,
          coverEmoji: latest[0]?.emoji ?? "📖",
          colorPalette: latest[0]?.colorPalette ?? "#D9BC3E",
          pages: savedPages,
        }),
      });

      if (!res.ok) {
        alert("저장에 실패했습니다.");
        setIsSaving(false);
        return;
      }

      const { id } = await res.json() as { id: string };
      router.push(`/my-library?new=${id}`);
    } finally {
      setIsSaving(false);
    }
  }, [pages, storyTitle, regenDirty, router]);

  const isRegenerating = editStates.some((s) => s.regenerating);

  // 모든 카드의 ref를 array에 보관 — framer-motion의 ref callback 재호출 한계 우회
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

  // activeIndex 또는 활성 카드 isEditing 변경 시 측정 + 그 카드에 ResizeObserver 부착
  const activeIsEditing = editStates[activeIndex]?.isEditing ?? false;
  useLayoutEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    const el = cardRefs.current[activeIndex];
    if (!el) return;
    setMeasuredHeight(el.offsetHeight);
    if (typeof ResizeObserver !== "undefined") {
      const obs = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setMeasuredHeight(entry.contentRect.height);
        }
      });
      obs.observe(el);
      observerRef.current = obs;
    }
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [activeIndex, activeIsEditing]);

  // 여유 마진 — transition 시간차와 subpixel 라운딩 보정
  const carouselHeight = Math.max((measuredHeight ?? 0) + 24, 520);

  const isLastCard = activeIndex === total - 1;

  return (
    <div
      style={{
        padding: "20px 0 80px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        alignItems: "center",
      }}
    >
      {/* 헤더 */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ textAlign: "center", padding: "0 16px" }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--color-brown-soft)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          나만의 동화책 완성!
        </p>
        <h1
          className="font-display"
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--color-brown)",
            marginTop: 6,
            lineHeight: 1.3,
            wordBreak: "keep-all",
          }}
        >
          {storyTitle}
        </h1>
      </motion.div>

      {/* 인디케이터 */}
      <div
        role="tablist"
        aria-label="페이지 선택"
        style={{ display: "flex", gap: 6, justifyContent: "center" }}
      >
        {pages.map((page, idx) => {
          const isDirty = editStates[idx]?.dirty;
          const isActive = idx === activeIndex;
          return (
            <button
              key={page.pageNumber}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${idx + 1} 페이지로 이동${isDirty ? " (수정됨)" : ""}`}
              onClick={() => setActiveIndex(idx)}
              style={{
                width: isActive ? 18 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                padding: 0,
                backgroundColor: isDirty
                  ? "#E07A5F"
                  : isActive
                    ? "var(--color-brown)"
                    : "var(--color-brown-soft)",
                opacity: isActive ? 1 : 0.4,
                cursor: "pointer",
                transition: "width 0.2s, opacity 0.2s, background-color 0.2s",
              }}
            />
          );
        })}
      </div>

      {/* 캐러셀 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: carouselHeight,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          overflow: "hidden",
          touchAction: "pan-y",
          transition: "height 0.2s ease-out",
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label="동화책 페이지"
      >
        {pages.map((page, idx) => {
          const offset = idx - activeIndex;
          const distance = Math.abs(offset);
          if (distance > 2) return null;

          const isActive = distance === 0;
          const cardState = editStates[idx];
          const isThisEditing = cardState.isEditing && isActive;

          const x = offset * 240;
          const scale = isActive ? 1 : 0.78;
          const opacity = isActive ? 1 : distance === 1 ? 0.5 : 0.18;
          const blur = isActive ? 0 : distance === 1 ? 2.5 : 5;
          const zIndex = 10 - distance;

          const displayBody = effectiveBody(cardState);
          const displayPalette = cardState.colorPalette;
          const displayEmoji = cardState.emoji;
          const isThisDirty = cardState.dirty;
          const isThisRegen = cardState.regenerating;

          return (
            <motion.div
              key={page.pageNumber}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${page.pageNumber} / ${total}: ${page.title}`}
              aria-hidden={!isActive}
              drag={isActive && !isThisEditing ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={handleDragEnd}
              animate={{ x, scale, opacity, filter: `blur(${blur}px)`, zIndex }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              style={{
                position: "absolute",
                width: 290,
                cursor: isActive
                  ? isThisEditing
                    ? "auto"
                    : "grab"
                  : "pointer",
                pointerEvents: distance > 1 ? "none" : "auto",
              }}
              onClick={() => {
                if (isThisEditing) return;
                if (offset === 1) goNext();
                else if (offset === -1) goPrev();
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "var(--radius-clay)",
                  overflow: "hidden",
                  boxShadow: isActive ? "var(--shadow-clay)" : "var(--shadow-clay-sm)",
                  border: "var(--border-clay)",
                  backgroundColor: "var(--color-card)",
                }}
              >
                {/* 이미지 영역 */}
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      backgroundColor: displayPalette,
                      aspectRatio: isThisEditing ? "3 / 2" : "3 / 4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isThisEditing ? 72 : 96,
                      transition: "background-color 0.4s ease",
                    }}
                    aria-hidden="true"
                  >
                    {isThisRegen ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            border: "3px solid rgba(255,255,255,0.3)",
                            borderTop: "3px solid #fff",
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                          }}
                        />
                        <p
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.9)",
                            fontWeight: 600,
                          }}
                        >
                          이미지 재생성 중...
                        </p>
                      </div>
                    ) : (
                      displayEmoji
                    )}
                  </div>
                  {isThisEditing && isThisDirty && !isThisRegen && (
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        backgroundColor: "#E07A5F",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 12,
                      }}
                    >
                      수정됨
                    </div>
                  )}
                  {isActive && !isThisEditing && (
                    <button
                      type="button"
                      onClick={() => toggleCardEdit(idx)}
                      disabled={isThisRegen}
                      aria-label="이 페이지 편집하기"
                      className="edit-toggle-btn"
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        padding: "6px 12px",
                        borderRadius: 16,
                        border: "1.5px solid var(--color-brown)",
                        backgroundColor: "var(--color-card)",
                        color: "var(--color-brown)",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: isThisRegen ? "not-allowed" : "pointer",
                        lineHeight: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "var(--shadow-clay-sm)",
                        zIndex: 5,
                      }}
                    >
                      내가 써볼래!
                    </button>
                  )}
                </div>

                {/* 텍스트 영역 */}
                <div
                  style={{
                    padding: "14px 16px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: isThisEditing ? 10 : 6,
                    position: "relative",
                  }}
                >
                  {isActive && isThisEditing && (
                    <button
                      type="button"
                      onClick={() => toggleCardEdit(idx)}
                      disabled={isThisRegen}
                      aria-label="편집 영역 접기"
                      className="edit-toggle-btn is-editing"
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        width: 30,
                        height: 30,
                        padding: 0,
                        borderRadius: "50%",
                        border: "1.5px solid var(--color-brown)",
                        backgroundColor: "var(--color-card)",
                        color: "var(--color-brown)",
                        cursor: isThisRegen ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "var(--shadow-clay-sm)",
                        zIndex: 5,
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                    </button>
                  )}

                  <p
                    className="font-display"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--color-brown-soft)",
                      lineHeight: 1.2,
                      paddingRight: isActive && isThisEditing ? 44 : 0,
                    }}
                  >
                    {page.pageNumber}. {page.title}
                  </p>

                  {isThisEditing ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {/* 기존 문장 */}
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--color-brown-soft)",
                            marginBottom: 6,
                          }}
                        >
                          원래 문장
                        </p>
                        <button
                          type="button"
                          onClick={() => resetCardBody(idx, page.body)}
                          aria-label="원래 문장으로 되돌리기"
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            padding: "8px 10px",
                            borderRadius: 10,
                            border:
                              displayBody === page.body
                                ? "2px solid var(--color-brown)"
                                : "1px dashed var(--color-brown-soft)",
                            backgroundColor:
                              displayBody === page.body
                                ? "rgba(93,64,39,0.08)"
                                : "rgba(93,64,39,0.04)",
                            fontSize: 12,
                            color: "var(--color-brown)",
                            lineHeight: 1.5,
                            cursor: "pointer",
                            wordBreak: "keep-all",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {page.body}
                        </button>
                      </div>

                      {aiCandidatesByPage[idx].length > 0 && (
                        <div>
                          <p
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "var(--color-brown-soft)",
                              marginBottom: 6,
                            }}
                          >
                            AI 추천 문장
                          </p>
                          <div
                            style={{ display: "flex", flexDirection: "column", gap: 6 }}
                          >
                            {aiCandidatesByPage[idx].map((candidate, cidx) => (
                              <button
                                key={cidx}
                                type="button"
                                onClick={() => pickCandidate(idx, candidate)}
                                style={{
                                  textAlign: "left",
                                  padding: "8px 10px",
                                  borderRadius: 10,
                                  border:
                                    displayBody === candidate
                                      ? "2px solid var(--color-brown)"
                                      : "1px solid var(--color-brown-soft)",
                                  backgroundColor:
                                    displayBody === candidate
                                      ? "rgba(93,64,39,0.08)"
                                      : "transparent",
                                  fontSize: 12,
                                  color: "var(--color-brown)",
                                  lineHeight: 1.5,
                                  cursor: "pointer",
                                  wordBreak: "keep-all",
                                }}
                              >
                                {candidate}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--color-brown-soft)",
                            marginBottom: 4,
                          }}
                        >
                          직접 써보기
                        </p>
                        <textarea
                          value={cardState.customInput}
                          onChange={(e) => updateCustomInput(idx, e.target.value)}
                          rows={3}
                          placeholder="나만의 이야기로 다시 써보세요"
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid var(--color-brown-soft)",
                            backgroundColor: "rgba(255,253,248,0.8)",
                            fontSize: 13,
                            color: "var(--color-brown)",
                            lineHeight: 1.55,
                            fontFamily: "var(--font-body)",
                            resize: "vertical",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--color-brown)",
                        lineHeight: 1.55,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {displayBody}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* 좌우 화살표 */}
        <button
          type="button"
          onClick={goPrev}
          disabled={activeIndex === 0}
          aria-label="이전 페이지"
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            position: "absolute",
            left: 8,
            top: "35%",
            transform: "translateY(-50%)",
            zIndex: 20,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "var(--border-clay)",
            backgroundColor: "var(--color-card)",
            color: "var(--color-brown)",
            cursor: activeIndex === 0 ? "not-allowed" : "pointer",
            opacity: activeIndex === 0 ? 0.35 : 1,
            boxShadow: "var(--shadow-clay-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        {isLastCard ? (
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isRegenerating}
            aria-label={
              isSaving
                ? "저장 중"
                : isRegenerating
                  ? "이미지 만드는 중"
                  : "나의 서재에 저장하기"
            }
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              position: "absolute",
              right: 8,
              top: "35%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: 48,
              height: 48,
              padding: 0,
              borderRadius: "50%",
              border: "none",
              backgroundColor: "var(--color-brown)",
              color: "#fffdf8",
              cursor: isSaving || isRegenerating ? "not-allowed" : "pointer",
              opacity: isSaving || isRegenerating ? 0.6 : 1,
              boxShadow: "var(--shadow-clay)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isSaving || isRegenerating ? (
              <span
                style={{
                  width: 18,
                  height: 18,
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTop: "2px solid #fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            aria-label="다음 페이지"
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              position: "absolute",
              right: 8,
              top: "35%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "var(--border-clay)",
              backgroundColor: "var(--color-card)",
              color: "var(--color-brown)",
              cursor: "pointer",
              boxShadow: "var(--shadow-clay-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        )}
      </div>


      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .edit-toggle-btn {
          opacity: 0.5;
          transition: opacity 0.2s ease, background-color 0.2s, color 0.2s;
        }
        .edit-toggle-btn:hover:not(:disabled),
        .edit-toggle-btn:focus-visible:not(:disabled) {
          opacity: 1;
        }
        .edit-toggle-btn.is-editing {
          opacity: 1;
        }
        .edit-toggle-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
