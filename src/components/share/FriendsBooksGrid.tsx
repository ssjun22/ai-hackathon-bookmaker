"use client";

import type { FriendBook, ReactionType } from "@/lib/mockFriendBooks";
import FriendBookCard from "./FriendBookCard";

export default function FriendsBooksGrid({
  friends,
  myReactions,
  onReact,
}: {
  friends: FriendBook[];
  myReactions: Record<string, ReactionType | null>;
  onReact: (friendBookId: string, type: ReactionType) => void;
}) {
  return (
    <section
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
      aria-label="친구들이 만든 책"
    >
      <h2
        className="font-display"
        style={{
          fontSize: 19,
          fontWeight: 700,
          color: "var(--color-brown)",
          fontFamily: "var(--font-display)",
        }}
      >
        친구들이 만든 책
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px 12px",
          justifyItems: "center",
          padding: "8px 0",
        }}
      >
        {friends.map((friend, i) => (
          <FriendBookCard
            key={friend.id}
            friend={friend}
            myReaction={myReactions[friend.id] ?? null}
            onReact={(type) => onReact(friend.id, type)}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
