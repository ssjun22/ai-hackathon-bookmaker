"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  REACTION_EMOJI,
  type FriendBook,
  type ReactionType,
} from "@/lib/mockFriendBooks";
import SmallBookCover from "./SmallBookCover";
import ReactionPicker from "./ReactionPicker";

export default function FriendBookCard({
  friend,
  myReaction,
  onReact,
  index,
}: {
  friend: FriendBook;
  myReaction: ReactionType | null;
  onReact: (type: ReactionType) => void;
  index: number;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <button
        type="button"
        onClick={() => setPickerOpen((v) => !v)}
        aria-label={`${friend.authorName}가 만든 책 — 반응 ${
          pickerOpen ? "닫기" : "남기기"
        }`}
        aria-expanded={pickerOpen}
        style={{
          position: "relative",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <SmallBookCover
          imageUrl={friend.imageUrl}
          emoji={friend.coverEmoji}
          colorPalette={friend.colorPalette}
          width={110}
          height={144}
        />

        {/* 내가 남긴 반응 뱃지 */}
        {myReaction && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -8,
              right: -8,
              width: 34,
              height: 34,
              borderRadius: "50%",
              backgroundColor: "var(--color-yellow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              boxShadow: "var(--shadow-clay-sm)",
              border: "2px solid var(--color-card)",
            }}
          >
            {REACTION_EMOJI[myReaction]}
          </span>
        )}
      </button>

      <p
        style={{
          fontSize: 13,
          color: "var(--color-brown-soft)",
          fontFamily: "var(--font-body)",
        }}
      >
        {friend.authorName}
      </p>

      <AnimatePresence>
        {pickerOpen && (
          <ReactionPicker
            selected={myReaction}
            onSelect={(type) => {
              onReact(type);
              setPickerOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
