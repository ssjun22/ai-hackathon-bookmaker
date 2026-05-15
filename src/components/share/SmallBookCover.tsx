"use client";

// LibraryBookCard 표지 스타일을 임의 크기로 재사용 (책장 카드와 같은 톤 유지)
export default function SmallBookCover({
  emoji,
  colorPalette,
  width,
  height,
}: {
  emoji: string;
  colorPalette: string;
  width: number;
  height: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: "4px 10px 10px 4px",
        background: `linear-gradient(135deg, ${colorPalette}dd 0%, ${colorPalette} 60%, ${colorPalette}aa 100%)`,
        boxShadow:
          "4px 6px 12px rgba(60,40,20,0.32), 2px 2px 4px rgba(60,40,20,0.16), inset 3px 0 4px rgba(0,0,0,0.18), inset -1px 0 3px rgba(255,255,255,0.18)",
        border: "1px solid rgba(60,40,20,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <span
        style={{ fontSize: Math.round(height * 0.45), lineHeight: 1, opacity: 0.9 }}
        aria-hidden="true"
      >
        {emoji}
      </span>
    </div>
  );
}
