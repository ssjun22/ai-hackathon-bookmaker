// 정적 서버 컴포넌트 — framer-motion 미사용
import FeltFilter from "@/components/FeltFilter";
import { motifMap } from "@/components/BookCoverMotifs";

type Palette = {
  bg: string;
  accent: string;
  bgDark?: string;
  titleColor?: string;
};

type Motif = "star" | "forest" | "rabbit" | "carrot";

interface BookCoverProps {
  title: string;
  palette: Palette;
  motif: Motif;
  width?: number;
  height?: number;
}

export default function BookCover({
  title,
  palette,
  motif,
  width = 110,
  height = 148,
}: BookCoverProps) {
  const Motif = motifMap[motif];
  const filterId = `felt-${motif}`;
  const gradId = `grad-${motif}`;
  const titleColor = palette.titleColor ?? palette.accent;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: "var(--radius-clay-sm)",
        overflow: "hidden",
        boxShadow: "var(--shadow-clay)",
        border: "var(--border-clay)",
        flexShrink: 0,
        position: "relative",
        // 좌측 옆면(spine) 표현 — 그라데이션으로 두께감
        background: `linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 5%, transparent 9%), ${palette.bg}`,
      }}
    >
      <svg
        viewBox="0 0 80 108"
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block" }}
      >
        <defs>
          {/* 펠트 노이즈 필터 — 부드럽게 */}
          <FeltFilter id={filterId} tight />
          {/* 표지 음영 — 위가 밝고 아래가 어두움 (펠트의 부드러운 입체감) */}
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
          </linearGradient>
        </defs>

        {/* 표지 음영 오버레이 (모티프 아래 깔림) */}
        <rect x="0" y="0" width="80" height="108" fill={`url(#${gradId})`} />

        {/* 제목 — 표지 상단에 직접 박힘 (검정 띠 없음) */}
        <text
          x="40"
          y="16"
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="700"
          fill={titleColor}
          style={{
            fontFamily: "var(--font-gowun), system-ui",
            filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.25))",
          }}
        >
          {title}
        </text>

        {/* 모티프 영역 (펠트 노이즈 적용) */}
        <g filter={`url(#${filterId})`}>
          <Motif accent={palette.accent} />
        </g>
      </svg>
    </div>
  );
}
