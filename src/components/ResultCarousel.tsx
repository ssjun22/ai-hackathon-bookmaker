"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import type { StoryPage } from "@/data/mockResults";
import { saveBook } from "@/lib/myBookStorage";
import type { SavedPage } from "@/lib/myBookStorage";

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
  body: string;
  colorPalette: string;
  emoji: string;
  dirty: boolean;
  regenerating: boolean;
};

export default function ResultCarousel({ storyTitle, pages }: ResultCarouselProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const total = pages.length;

  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editStates, setEditStates] = useState<EditState[]>(
    pages.map((p) => ({
      body: p.body,
      colorPalette: p.colorPalette,
      emoji: p.emoji,
      dirty: false,
      regenerating: false,
    }))
  );

  // await 후에도 최신 editStates를 읽기 위한 ref (handleSave의 stale closure 방지)
  const editStatesRef = useRef(editStates);
  editStatesRef.current = editStates;

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

  const updateBody = useCallback((idx: number, value: string) => {
    setEditStates((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, body: value, dirty: true } : s))
    );
  }, []);

  const pickCandidate = useCallback((idx: number, candidate: string) => {
    setEditStates((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, body: candidate, dirty: true } : s))
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
      const savedPages: SavedPage[] = pages.map((p, i) => ({
        pageNumber: p.pageNumber,
        title: p.title,
        body: latest[i].body,
        colorPalette: latest[i].colorPalette,
        emoji: latest[i].emoji,
        imageUrl: p.imageUrl,
      }));

      const bookSaved = {
        id: crypto.randomUUID(),
        storyTitle,
        coverEmoji: latest[0]?.emoji ?? "📖",
        colorPalette: latest[0]?.colorPalette ?? "#D9BC3E",
        pages: savedPages,
        createdAt: new Date().toISOString(),
      };

      saveBook(bookSaved);
      router.push(`/my-library?new=${bookSaved.id}`);
    } finally {
      setIsSaving(false);
    }
  }, [pages, storyTitle, regenDirty, router]);

  const hasDirty = editStates.some((s) => s.dirty);
  const isRegenerating = editStates.some((s) => s.regenerating);

  const carouselHeight = editMode ? 640 : 520;

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
        style={{
          textAlign: "center",
          padding: "0 16px",
          position: "relative",
          width: "100%",
          boxSizing: "border-box",
        }}
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
          {editMode ? "내 이야기 편집하기" : "나만의 동화책 완성!"}
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
        {editMode && (
          <button
            type="button"
            onClick={() => setEditMode(false)}
            disabled={isSaving || isRegenerating}
            aria-label="편집 모드 끝내기"
            style={{
              position: "absolute",
              right: 16,
              top: 0,
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "var(--border-clay)",
              backgroundColor: "var(--color-card)",
              color: "var(--color-brown)",
              fontSize: 14,
              fontWeight: 700,
              cursor: isSaving || isRegenerating ? "not-allowed" : "pointer",
              opacity: isSaving || isRegenerating ? 0.4 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-clay-sm)",
              padding: 0,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        )}
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
                backgroundColor:
                  editMode && isDirty
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
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          touchAction: "pan-y",
          transition: "height 0.3s ease",
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
          const isEditingThisCard = editMode && isActive;

          const x = offset * 240;
          const scale = isActive ? 1 : 0.78;
          const opacity = isActive ? 1 : distance === 1 ? 0.5 : 0.18;
          const blur = isActive ? 0 : distance === 1 ? 2.5 : 5;
          const zIndex = 10 - distance;

          const cardState = editStates[idx];
          const displayBody = cardState.body;
          const displayPalette = cardState.colorPalette;
          const displayEmoji = cardState.emoji;
          const isThisDirty = cardState.dirty;
          const isThisRegen = cardState.regenerating;

          return (
            <motion.div
              key={page.pageNumber}
              role="group"
              aria-roledescription="slide"
              aria-label={`${page.pageNumber} / ${total}: ${page.title}`}
              aria-hidden={!isActive}
              drag={isActive && !isEditingThisCard ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={handleDragEnd}
              animate={{ x, scale, opacity, filter: `blur(${blur}px)`, zIndex }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              style={{
                position: "absolute",
                width: 290,
                cursor: isActive
                  ? isEditingThisCard
                    ? "auto"
                    : "grab"
                  : "pointer",
                pointerEvents: distance > 1 ? "none" : "auto",
              }}
              onClick={() => {
                if (isEditingThisCard) return;
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
                      aspectRatio: isEditingThisCard ? "3 / 2" : "3 / 4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isEditingThisCard ? 72 : 96,
                      transition:
                        "background-color 0.4s ease, aspect-ratio 0.3s ease, font-size 0.3s ease",
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
                  {isEditingThisCard && isThisDirty && !isThisRegen && (
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
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
                </div>

                {/* 텍스트 영역 */}
                <div
                  style={{
                    padding: "14px 16px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: isEditingThisCard ? 10 : 6,
                  }}
                >
                  <p
                    className="font-display"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--color-brown-soft)",
                      lineHeight: 1.2,
                    }}
                  >
                    {page.pageNumber}. {page.title}
                  </p>

                  {isEditingThisCard ? (
                    <>
                      {page.bodyCandidates && page.bodyCandidates.length > 0 && (
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
                            {page.bodyCandidates.map((candidate, cidx) => (
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
                          직접 수정하기
                        </p>
                        <textarea
                          value={displayBody}
                          onChange={(e) => updateBody(idx, e.target.value)}
                          rows={3}
                          placeholder="내용을 직접 입력해보세요..."
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
                    </>
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
            zIndex: 20,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "var(--border-clay)",
            backgroundColor: "var(--color-card)",
            color: "var(--color-brown)",
            fontSize: 18,
            fontWeight: 700,
            cursor: activeIndex === 0 ? "not-allowed" : "pointer",
            opacity: activeIndex === 0 ? 0.35 : 1,
            boxShadow: "var(--shadow-clay-sm)",
          }}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={activeIndex === total - 1}
          aria-label="다음 페이지"
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            position: "absolute",
            right: 8,
            zIndex: 20,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "var(--border-clay)",
            backgroundColor: "var(--color-card)",
            color: "var(--color-brown)",
            fontSize: 18,
            fontWeight: 700,
            cursor: activeIndex === total - 1 ? "not-allowed" : "pointer",
            opacity: activeIndex === total - 1 ? 0.35 : 1,
            boxShadow: "var(--shadow-clay-sm)",
          }}
        >
          ›
        </button>
      </div>

      {/* 편집 모드 dirty 요약 */}
      {editMode && hasDirty && (
        <div
          style={{
            width: "min(340px, 92vw)",
            padding: "10px 14px",
            borderRadius: 12,
            backgroundColor: "rgba(224,122,95,0.1)",
            border: "1px solid rgba(224,122,95,0.3)",
          }}
        >
          <p style={{ fontSize: 12, color: "#C05A40", fontWeight: 600 }}>
            수정된 페이지:{" "}
            {editStates
              .map((s, i) => (s.dirty ? `${i + 1}장` : null))
              .filter(Boolean)
              .join(", ")}
          </p>
          <p style={{ fontSize: 11, color: "#C05A40", marginTop: 2 }}>
            재생성 버튼을 눌러 이미지를 업데이트하세요.
          </p>
        </div>
      )}

      {/* 하단 액션 */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: "min(340px, 92vw)",
        }}
      >
        {editMode ? (
          <>
            <button
              type="button"
              onClick={regenDirty}
              disabled={!hasDirty || isRegenerating}
              style={{
                padding: "13px 20px",
                borderRadius: 24,
                border: "2px solid var(--color-brown)",
                backgroundColor: "transparent",
                color: "var(--color-brown)",
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                cursor: hasDirty && !isRegenerating ? "pointer" : "not-allowed",
                opacity: !hasDirty || isRegenerating ? 0.4 : 1,
              }}
            >
              {isRegenerating ? "이미지 재생성 중..." : "🔄 이미지 재생성"}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isRegenerating}
              style={{
                padding: "14px 20px",
                borderRadius: 24,
                border: "none",
                backgroundColor: "var(--color-brown)",
                color: "#fffdf8",
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                cursor: isSaving || isRegenerating ? "not-allowed" : "pointer",
                opacity: isSaving || isRegenerating ? 0.6 : 1,
                boxShadow: "var(--shadow-clay-sm)",
              }}
            >
              {isSaving ? "저장 중..." : "📚 나의 서재에 저장하기"}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setEditMode(true)}
              style={{
                padding: "13px 28px",
                borderRadius: 24,
                border: "2px solid var(--color-brown)",
                backgroundColor: "transparent",
                color: "var(--color-brown)",
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                cursor: "pointer",
                boxShadow: "var(--shadow-clay-sm)",
              }}
            >
              ✏️ 내용 편집하기
            </button>
            <a
              href="/create"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                borderRadius: 24,
                backgroundColor: "var(--color-brown)",
                color: "#fffdf8",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                textDecoration: "none",
                boxShadow: "var(--shadow-clay-sm)",
                textAlign: "center",
              }}
            >
              다른 책으로 만들기
            </a>
          </>
        )}
      </motion.div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
