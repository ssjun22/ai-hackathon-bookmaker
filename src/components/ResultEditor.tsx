"use client";

// 단일 세션 가정 — 페이지 이탈 시 편집 내용 손실 허용
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { StoryPage } from "@/data/mockResults";
import { saveBook } from "@/lib/myBookStorage";
import type { SavedPage } from "@/lib/myBookStorage";

// 재생성 mock: colorPalette 순환 + emoji 교체 후보
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

interface ResultEditorProps {
  storyTitle: string;
  pages: StoryPage[];
}

export default function ResultEditor({ storyTitle, pages }: ResultEditorProps) {
  const router = useRouter();

  const [editStates, setEditStates] = useState<EditState[]>(
    pages.map((p) => ({
      body: p.body,
      colorPalette: p.colorPalette,
      emoji: p.emoji,
      dirty: false,
      regenerating: false,
    }))
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const updateBody = useCallback((idx: number, value: string) => {
    setEditStates((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, body: value, dirty: true } : s
      )
    );
  }, []);

  const pickCandidate = useCallback((idx: number, candidate: string) => {
    setEditStates((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, body: candidate, dirty: true } : s
      )
    );
  }, []);

  const regenDirty = useCallback(async () => {
    const dirtyIndices = editStates
      .map((s, i) => (s.dirty ? i : -1))
      .filter((i) => i >= 0);

    if (dirtyIndices.length === 0) return;

    // dirty 페이지 재생성 시작
    setEditStates((prev) =>
      prev.map((s, i) =>
        dirtyIndices.includes(i) ? { ...s, regenerating: true } : s
      )
    );

    // 1.5초 가짜 로딩 후 colorPalette/emoji 변형
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setEditStates((prev) =>
      prev.map((s, i) =>
        dirtyIndices.includes(i)
          ? {
              ...s,
              regenerating: false,
              dirty: false,
              colorPalette: nextPalette(s.colorPalette),
              emoji: nextEmoji(s.emoji),
            }
          : s
      )
    );
  }, [editStates]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // dirty 페이지가 있으면 자동 재생성 먼저
      const hasDirty = editStates.some((s) => s.dirty);
      if (hasDirty) {
        await regenDirty();
      }

      const savedPages: SavedPage[] = pages.map((p, i) => ({
        pageNumber: p.pageNumber,
        title: p.title,
        body: editStates[i].body,
        colorPalette: editStates[i].colorPalette,
        emoji: editStates[i].emoji,
        imageUrl: p.imageUrl,
      }));

      const bookSaved = {
        id: crypto.randomUUID(),
        storyTitle,
        coverEmoji: editStates[0]?.emoji ?? "📖",
        colorPalette: editStates[0]?.colorPalette ?? "#D9BC3E",
        pages: savedPages,
        createdAt: new Date().toISOString(),
      };

      saveBook(bookSaved);
      router.push(`/my-library?new=${bookSaved.id}`);
    } finally {
      setIsSaving(false);
    }
  }, [editStates, pages, storyTitle, regenDirty, router]);

  const hasDirty = editStates.some((s) => s.dirty);
  const isRegenerating = editStates.some((s) => s.regenerating);

  const page = pages[activeIndex];
  const state = editStates[activeIndex];

  return (
    <div
      style={{
        padding: "20px 0 100px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
        minHeight: "calc(100dvh - 56px - 64px)",
        backgroundColor: "var(--color-beige)",
      }}
    >
      {/* 헤더 */}
      <div style={{ textAlign: "center", padding: "0 16px" }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--color-brown-soft)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          내 이야기 편집하기
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
      </div>

      {/* 페이지 탭 */}
      <div
        role="tablist"
        aria-label="페이지 선택"
        style={{
          display: "flex",
          gap: 6,
          justifyContent: "center",
          flexWrap: "wrap",
          padding: "0 16px",
        }}
      >
        {pages.map((p, idx) => {
          const isActive = idx === activeIndex;
          const isDirty = editStates[idx]?.dirty;
          return (
            <button
              key={p.pageNumber}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveIndex(idx)}
              style={{
                padding: "4px 10px",
                borderRadius: 20,
                border: isActive
                  ? "2px solid var(--color-brown)"
                  : "1px solid var(--color-brown-soft)",
                backgroundColor: isActive ? "var(--color-brown)" : "transparent",
                color: isActive ? "#fffdf8" : "var(--color-brown-soft)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                position: "relative",
              }}
            >
              {p.pageNumber}. {p.title}
              {isDirty && (
                <span
                  aria-label="수정됨"
                  style={{
                    marginLeft: 4,
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#E07A5F",
                    verticalAlign: "middle",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 편집 카드 */}
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          width: "min(340px, 92vw)",
          borderRadius: "var(--radius-clay)",
          border: "var(--border-clay)",
          backgroundColor: "var(--color-card)",
          boxShadow: "var(--shadow-clay)",
          overflow: "hidden",
        }}
      >
        {/* 이미지 영역 (emoji + colorPalette) */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              backgroundColor: state.colorPalette,
              aspectRatio: "3 / 2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 72,
              transition: "background-color 0.4s ease",
            }}
            aria-hidden="true"
          >
            {state.regenerating ? (
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
              state.emoji
            )}
          </div>
          {state.dirty && !state.regenerating && (
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

        {/* 텍스트 편집 영역 */}
        <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          <p
            className="font-display"
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--color-brown-soft)",
            }}
          >
            {page.pageNumber}. {page.title}
          </p>

          {/* AI 보기 후보 칩 */}
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
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {page.bodyCandidates.map((candidate, cidx) => (
                  <button
                    key={cidx}
                    type="button"
                    onClick={() => pickCandidate(activeIndex, candidate)}
                    style={{
                      textAlign: "left",
                      padding: "8px 10px",
                      borderRadius: 10,
                      border:
                        state.body === candidate
                          ? "2px solid var(--color-brown)"
                          : "1px solid var(--color-brown-soft)",
                      backgroundColor:
                        state.body === candidate
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

          {/* 직접 입력 textarea */}
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
              value={state.body}
              onChange={(e) => updateBody(activeIndex, e.target.value)}
              rows={4}
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
        </div>
      </motion.div>

      {/* 전체 요약 (모든 페이지 dirty 상태 미리보기) */}
      {hasDirty && (
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

      {/* 하단 액션 버튼 */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexDirection: "column",
          width: "min(340px, 92vw)",
        }}
      >
        <button
          type="button"
          onClick={regenDirty}
          disabled={!hasDirty || isRegenerating}
          style={{
            padding: "13px 20px",
            borderRadius: 24,
            border: "2px solid var(--color-brown)",
            backgroundColor: hasDirty && !isRegenerating ? "transparent" : "transparent",
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
      </div>

      {/* 스핀 애니메이션 keyframe */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
