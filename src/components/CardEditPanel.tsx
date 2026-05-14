"use client";

import type { EditState } from "./ResultCarousel";

interface CardEditPanelProps {
  pageIndex: number;
  originalBody: string;
  aiCandidates: string[];
  cardState: EditState;
  displayBody: string;
  onUpdateCustomInput: (idx: number, value: string) => void;
  onPickCandidate: (idx: number, candidate: string) => void;
  onResetBody: (idx: number, originalBody: string) => void;
  onToggleEdit: (idx: number) => void;
  disabled?: boolean;
}

export default function CardEditPanel({
  pageIndex,
  originalBody,
  aiCandidates,
  cardState,
  displayBody,
  onUpdateCustomInput,
  onPickCandidate,
  onResetBody,
  onToggleEdit,
  disabled = false,
}: CardEditPanelProps) {
  return (
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
          onClick={() => onResetBody(pageIndex, originalBody)}
          aria-label="원래 문장으로 되돌리기"
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "8px 10px",
            borderRadius: 10,
            border:
              displayBody === originalBody
                ? "2px solid var(--color-brown)"
                : "1px dashed var(--color-brown-soft)",
            backgroundColor:
              displayBody === originalBody
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
          {originalBody}
        </button>
      </div>

      {aiCandidates.length > 0 && (
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
            {aiCandidates.map((candidate, cidx) => (
              <button
                key={cidx}
                type="button"
                onClick={() => onPickCandidate(pageIndex, candidate)}
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
          onChange={(e) => onUpdateCustomInput(pageIndex, e.target.value)}
          rows={3}
          placeholder="나만의 이야기로 다시 써보세요"
          disabled={disabled}
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
  );
}
