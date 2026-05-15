"use client";

import type { MyBook } from "@/lib/types";
import type { ReactionType } from "@/lib/mockFriendBooks";
import SmallBookCover from "./SmallBookCover";
import ReactionBadges from "./ReactionBadges";

export default function MyBookSection({
  book,
  sharedAt,
  reactions,
}: {
  book: MyBook;
  sharedAt: string;
  reactions: Record<ReactionType, number>;
}) {
  return (
    <section
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
      aria-label="내가 만든 책"
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
        내가 만든 책
      </h2>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <SmallBookCover
          imageUrl={book.coverImageUrl}
          width={118}
          height={158}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            paddingTop: 4,
            minWidth: 0,
          }}
        >
          <p
            style={{
              fontSize: 16,
              color: "var(--color-brown)",
              fontFamily: "var(--font-body)",
              lineHeight: 1.4,
            }}
          >
            친구들에게 보여 준 날
            <br />
            <span style={{ fontWeight: 700 }}>: {sharedAt}</span>
          </p>

          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--color-brown)",
              fontFamily: "var(--font-body)",
            }}
          >
            내가 받은 반응들
          </p>

          <ReactionBadges counts={reactions} />
        </div>
      </div>
    </section>
  );
}
