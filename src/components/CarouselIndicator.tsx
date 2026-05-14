"use client";

import type { StoryPage } from "@/lib/types";
import type { EditState } from "./ResultCarousel";

interface CarouselIndicatorProps {
  pages: StoryPage[];
  activeIndex: number;
  editStates: EditState[];
  onSelect: (idx: number) => void;
}

export default function CarouselIndicator({
  pages,
  activeIndex,
  editStates,
  onSelect,
}: CarouselIndicatorProps) {
  return (
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
            onClick={() => onSelect(idx)}
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
  );
}
