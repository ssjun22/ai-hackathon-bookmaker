"use client";

import { motion } from "framer-motion";
import {
  REACTION_EMOJI,
  REACTION_LABEL,
  REACTION_ORDER,
  type ReactionType,
} from "@/lib/mockFriendBooks";

export default function ReactionPicker({
  selected,
  onSelect,
}: {
  selected: ReactionType | null;
  onSelect: (type: ReactionType) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      style={{
        display: "flex",
        gap: 8,
        padding: "6px 8px",
        borderRadius: 999,
        backgroundColor: "var(--color-card)",
        boxShadow: "var(--shadow-clay-sm)",
      }}
    >
      {REACTION_ORDER.map((type) => {
        const isActive = selected === type;
        return (
          <button
            key={type}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(type);
            }}
            aria-label={`${REACTION_LABEL[type]} 반응 ${
              isActive ? "취소" : "남기기"
            }`}
            aria-pressed={isActive}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "none",
              backgroundColor: isActive
                ? "var(--color-yellow)"
                : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              cursor: "pointer",
              transition: "background-color 0.15s ease, transform 0.15s ease",
              transform: isActive ? "scale(1.08)" : "scale(1)",
            }}
          >
            <span aria-hidden="true">{REACTION_EMOJI[type]}</span>
          </button>
        );
      })}
    </motion.div>
  );
}
