"use client";

import { useState } from "react";
import SmallBookCover from "./SmallBookCover";

// 와이어프레임 상단: 원본 책 이미지 + 책 제목
// imageUrl이 있고 로드되면 이미지로 표시, 실패 시 emoji 표지로 폴백
export default function ShareHeader({
  title,
  imageUrl,
  coverEmoji,
  colorPalette,
}: {
  title: string;
  imageUrl?: string;
  coverEmoji: string;
  colorPalette: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = imageUrl && !imgFailed;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "4px 4px 8px",
      }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={`${title} 원본 표지`}
          onError={() => setImgFailed(true)}
          style={{
            width: 88,
            height: 116,
            objectFit: "cover",
            borderRadius: "4px 10px 10px 4px",
            boxShadow:
              "4px 6px 12px rgba(60,40,20,0.32), 2px 2px 4px rgba(60,40,20,0.16)",
            border: "1px solid rgba(60,40,20,0.08)",
            flexShrink: 0,
            backgroundColor: "var(--color-card)",
          }}
        />
      ) : (
        <SmallBookCover
          emoji={coverEmoji}
          colorPalette={colorPalette}
          width={88}
          height={116}
        />
      )}
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 700,
          color: "var(--color-brown)",
          lineHeight: 1.3,
          wordBreak: "keep-all",
        }}
      >
        {title}
      </p>
    </div>
  );
}
