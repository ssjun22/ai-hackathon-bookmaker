"use client";

interface CarouselControlsProps {
  activeIndex: number;
  isLastCard: boolean;
  isSaving: boolean;
  isRegenerating: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
}

export default function CarouselControls({
  activeIndex,
  isLastCard,
  isSaving,
  isRegenerating,
  onPrev,
  onNext,
  onSave,
}: CarouselControlsProps) {
  return (
    <>
      {/* 이전 버튼 */}
      <button
        type="button"
        onClick={onPrev}
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

      {/* 다음/저장 버튼 */}
      {isLastCard ? (
        <button
          type="button"
          onClick={onSave}
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
          onClick={onNext}
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
    </>
  );
}
