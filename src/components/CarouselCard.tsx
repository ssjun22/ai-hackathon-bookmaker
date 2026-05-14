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
  displayPalette: string;
  displayEmoji: string;
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
  displayPalette,
  displayEmoji,
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
              onClick={(e) => {
                e.stopPropagation();
                onToggleEdit(pageIndex);
              }}
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
      </div>
    </motion.div>
  );
}
