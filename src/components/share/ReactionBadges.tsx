"use client";

import {
  REACTION_EMOJI,
  REACTION_LABEL,
  REACTION_ORDER,
  type ReactionType,
} from "@/lib/mockFriendBooks";

// 받은 반응 집계 표시 — 읽기 전용
export default function ReactionBadges({
  counts,
}: {
  counts: Record<ReactionType, number>;
}) {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
      {REACTION_ORDER.map((type) => (
        <div
          key={type}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 999,
            backgroundColor: "var(--color-card)",
            boxShadow: "var(--shadow-clay-sm)",
          }}
        >
          <span
            style={{ fontSize: 20, lineHeight: 1 }}
            aria-label={REACTION_LABEL[type]}
          >
            {REACTION_EMOJI[type]}
          </span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--color-brown)",
              fontFamily: "var(--font-body)",
            }}
          >
            {counts[type]}
          </span>
        </div>
      ))}
    </div>
  );
}
