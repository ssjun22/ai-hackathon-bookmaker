// 정적 서버 컴포넌트 — framer-motion 미사용
import type { ReactElement } from "react";

type Palette = {
  bg: string;
  accent: string;
};

type Motif = "star" | "forest" | "rabbit" | "carrot";

interface BookCoverProps {
  title: string;
  palette: Palette;
  motif: Motif;
  width?: number;
  height?: number;
}

function StarMotif({ accent }: { accent: string }) {
  return (
    <>
      {/* 펠트 노이즈 필터 */}
      <defs>
        <filter id="felt-star" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g filter="url(#felt-star)">
        {/* 큰 별 */}
        <polygon
          points="40,12 44,26 58,26 47,34 51,48 40,40 29,48 33,34 22,26 36,26"
          fill={accent}
          opacity="0.9"
        />
        {/* 작은 별들 */}
        <polygon
          points="15,45 17,51 23,51 18,55 20,61 15,57 10,61 12,55 7,51 13,51"
          fill={accent}
          opacity="0.6"
        />
        <polygon
          points="62,52 63,56 67,56 64,58 65,62 62,60 59,62 60,58 57,56 61,56"
          fill={accent}
          opacity="0.5"
        />
      </g>
    </>
  );
}

function ForestMotif({ accent }: { accent: string }) {
  return (
    <>
      <defs>
        <filter id="felt-forest" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g filter="url(#felt-forest)">
        {/* 오두막 */}
        <rect x="28" y="44" width="24" height="18" fill={accent} opacity="0.9" />
        {/* 지붕 */}
        <polygon points="24,44 40,26 56,44" fill={accent} opacity="0.8" />
        {/* 문 */}
        <rect x="36" y="52" width="8" height="10" fill="rgba(0,0,0,0.2)" />
        {/* 나무들 */}
        <polygon points="14,62 20,40 26,62" fill={accent} opacity="0.6" />
        <polygon points="54,62 60,42 66,62" fill={accent} opacity="0.6" />
      </g>
    </>
  );
}

function RabbitMotif({ accent }: { accent: string }) {
  return (
    <>
      <defs>
        <filter id="felt-rabbit" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g filter="url(#felt-rabbit)">
        {/* 토끼 몸 */}
        <ellipse cx="40" cy="50" rx="14" ry="16" fill={accent} opacity="0.9" />
        {/* 토끼 머리 */}
        <circle cx="40" cy="33" r="11" fill={accent} opacity="0.9" />
        {/* 귀 */}
        <ellipse cx="33" cy="18" rx="4" ry="9" fill={accent} opacity="0.8" />
        <ellipse cx="47" cy="18" rx="4" ry="9" fill={accent} opacity="0.8" />
        {/* 귀 안쪽 */}
        <ellipse cx="33" cy="18" rx="2" ry="6" fill="rgba(255,150,150,0.5)" />
        <ellipse cx="47" cy="18" rx="2" ry="6" fill="rgba(255,150,150,0.5)" />
        {/* 눈 */}
        <circle cx="36" cy="33" r="1.5" fill="rgba(0,0,0,0.5)" />
        <circle cx="44" cy="33" r="1.5" fill="rgba(0,0,0,0.5)" />
        {/* 코 */}
        <ellipse cx="40" cy="38" rx="2" ry="1.2" fill="rgba(255,150,150,0.7)" />
      </g>
    </>
  );
}

function CarrotMotif({ accent }: { accent: string }) {
  return (
    <>
      <defs>
        <filter id="felt-carrot" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g filter="url(#felt-carrot)">
        {/* 당근 몸체 */}
        <path d="M32,28 Q28,50 40,68 Q52,50 48,28 Z" fill="#FF8C42" opacity="0.9" />
        {/* 당근 선 */}
        <path d="M36,32 Q35,50 40,62" stroke="rgba(200,80,0,0.3)" strokeWidth="1.5" fill="none" />
        <path d="M44,32 Q45,50 40,62" stroke="rgba(200,80,0,0.3)" strokeWidth="1.5" fill="none" />
        {/* 잎사귀 */}
        <path d="M40,28 Q32,16 28,20 Q34,22 40,28" fill={accent} opacity="0.85" />
        <path d="M40,28 Q48,14 52,18 Q46,22 40,28" fill={accent} opacity="0.85" />
        <path d="M40,28 Q36,14 36,10 Q40,16 40,28" fill={accent} opacity="0.7" />
        <path d="M40,28 Q44,14 44,10 Q40,16 40,28" fill={accent} opacity="0.7" />
      </g>
    </>
  );
}

export default function BookCover({
  title,
  palette,
  motif,
  width = 110,
  height = 148,
}: BookCoverProps) {
  const motifComponents: Record<Motif, ReactElement> = {
    star: <StarMotif accent={palette.accent} />,
    forest: <ForestMotif accent={palette.accent} />,
    rabbit: <RabbitMotif accent={palette.accent} />,
    carrot: <CarrotMotif accent={palette.accent} />,
  };

  return (
    <div
      style={{
        width,
        height,
        borderRadius: "var(--radius-felt-sm)",
        overflow: "hidden",
        backgroundColor: palette.bg,
        boxShadow: "var(--shadow-felt)",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* 일러스트 SVG */}
      <svg
        viewBox="0 0 80 80"
        width={width}
        height={width}
        style={{ display: "block" }}
      >
        {motifComponents[motif]}
      </svg>

      {/* 제목 */}
      <div
        style={{
          padding: "4px 8px 6px",
          backgroundColor: "rgba(0,0,0,0.08)",
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: palette.accent,
            lineHeight: 1.3,
            wordBreak: "keep-all",
          }}
        >
          {title}
        </p>
      </div>
    </div>
  );
}
