"use client";

import { motion } from "framer-motion";
import type { StoryPage } from "@/lib/types";
import type { EditState } from "./ResultCarousel";
import CardEditPanel from "./CardEditPanel";

interface CarouselCardProps {
  page: StoryPage;
  pageIndex: number;
  total: number;
  offset: number;
  isActive: boolean;
  isThisEditing: boolean;
  isThisDirty: boolean;
  isThisRegen: boolean;
  displayBody: string;
  cardState: EditState;
  aiCandidates: string[];
  cardRef: (el: HTMLDivElement | null) => void;
  onDragEnd: (_: unknown, info: import("framer-motion").PanInfo) => void;
  onCardClick: () => void;
  onToggleEdit: (idx: number) => void;
  onUpdateCustomInput: (idx: number, value: string) => void;
  onPickCandidate: (idx: number, candidate: string) => void;
  onResetBody: (idx: number, originalBody: string) => void;
}

export default function CarouselCard({
  page,
  pageIndex,
  total,
  offset,
  isActive,
  isThisEditing,
  isThisDirty,
  isThisRegen,
  displayBody,
  cardState,
  aiCandidates,
  cardRef,
  onDragEnd,
  onCardClick,
  onToggleEdit,
  onUpdateCustomInput,
  onPickCandidate,
  onResetBody,
}: CarouselCardProps) {
  const distance = Math.abs(offset);
  const x = offset * 240;
  const scale = isActive ? 1 : 0.78;
  const opacity = isActive ? 1 : distance === 1 ? 0.5 : 0.18;
  const blur = isActive ? 0 : distance === 1 ? 2.5 : 5;
  const zIndex = 10 - distance;
  const isCover = page.kind === "cover";

  return (
    <motion.div
      ref={cardRef}
      role="group"
      aria-roledescription="slide"
      aria-label={`${page.pageNumber} / ${total}: ${page.title}`}
      aria-hidden={!isActive}
      drag={isActive && !isThisEditing ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.18}
      onDragEnd={onDragEnd}
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
      onClick={onCardClick}
    >
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
        {/* 이미지 영역 — 표지일 땐 일반 카드 전체 높이와 비슷하게 늘리고 비율 유지(contain) */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              aspectRatio: isCover
                ? "3 / 5"
                : isThisEditing
                  ? "3 / 2"
                  : "3 / 4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              backgroundColor: isCover ? "var(--color-card)" : "#f1f5f9",
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
                    border: "3px solid rgba(100,100,100,0.2)",
                    borderTop: "3px solid #888",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(80,80,80,0.9)",
                    fontWeight: 600,
                  }}
                >
                  이미지 재생성 중...
                </p>
              </div>
            ) : page.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={page.imageUrl}
                alt={isCover ? `${page.title} 표지 이미지` : `${page.title} 장면 이미지`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: isCover ? "contain" : "cover",
                  objectPosition: "center",
                }}
              />
            ) : (
              // fallback: 단색 배경 + 책 아이콘
              <span style={{ fontSize: isThisEditing ? 56 : 72, lineHeight: 1 }} aria-hidden="true">
                📖
              </span>
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

        </div>

        {/* 텍스트 영역 — 표지 카드는 이미지 안에 제목이 그려져 있어 텍스트 영역 자체를 생략 */}
        {!isCover && (
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
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleEdit(pageIndex);
                }}
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
              <CardEditPanel
                pageIndex={pageIndex}
                originalBody={page.body}
                aiCandidates={aiCandidates}
                cardState={cardState}
                displayBody={displayBody}
                onUpdateCustomInput={onUpdateCustomInput}
                onPickCandidate={onPickCandidate}
                onResetBody={onResetBody}
                disabled={isThisRegen}
              />
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
        )}
      </div>
    </motion.div>
  );
}
