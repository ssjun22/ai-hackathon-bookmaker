"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MyBook } from "@/lib/types";
import {
  mockFriendBooks,
  SOURCE_BOOK,
  type ReactionType,
} from "@/lib/mockFriendBooks";
import ShareHeader from "./ShareHeader";
import MyBookSection from "./MyBookSection";
import FriendsBooksGrid from "./FriendsBooksGrid";

// 내가 받은 반응 — 시연용 mock
const MOCK_RECEIVED_REACTIONS: Record<ReactionType, number> = {
  smile: 12,
  thumb: 8,
  gift: 3,
};

function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export default function ShareClient({ book }: { book: MyBook }) {
  const router = useRouter();
  // 친구 책에 내가 남긴 반응 (로컬 상태 — 백엔드 저장은 추후)
  const [myReactions, setMyReactions] = useState<
    Record<string, ReactionType | null>
  >({});

  const handleReact = (friendBookId: string, type: ReactionType) => {
    setMyReactions((prev) => ({
      ...prev,
      [friendBookId]: prev[friendBookId] === type ? null : type,
    }));
  };

  return (
    <div
      style={{
        padding: "28px 20px 80px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <h1
        className="font-display"
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: "var(--color-brown)",
          textAlign: "center",
          fontFamily: "var(--font-display)",
        }}
      >
        친구들과 함께 보기
      </h1>

      <ShareHeader
        title={SOURCE_BOOK.title}
        imageUrl={SOURCE_BOOK.imageUrl}
        coverEmoji={SOURCE_BOOK.coverEmoji}
        colorPalette={SOURCE_BOOK.colorPalette}
      />

      <div
        aria-hidden="true"
        style={{
          height: 1,
          backgroundColor: "var(--color-brown)",
          opacity: 0.4,
          margin: "4px 0",
        }}
      />

      <MyBookSection
        book={book}
        sharedAt={todayString()}
        reactions={MOCK_RECEIVED_REACTIONS}
      />

      <FriendsBooksGrid
        friends={mockFriendBooks.slice(0, 4)}
        myReactions={myReactions}
        onReact={handleReact}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 8,
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/my-library")}
          style={{
            padding: "12px 24px",
            borderRadius: 24,
            border: "2px solid var(--color-brown)",
            backgroundColor: "transparent",
            color: "var(--color-brown)",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            cursor: "pointer",
          }}
        >
          ← 서재로 돌아가기
        </button>
      </div>
    </div>
  );
}
