// 정적 서버 컴포넌트 — framer-motion 미사용
import FeltFilter from "@/components/FeltFilter";

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

function StarMotif({ accent }: { accent: string }) {
  return (
    <g>
      {/* 점선 별자리 */}
      <line x1="14" y1="32" x2="28" y2="26" stroke={accent} strokeWidth="0.8" strokeDasharray="1.5 2" opacity="0.55" />
      <line x1="28" y1="26" x2="40" y2="34" stroke={accent} strokeWidth="0.8" strokeDasharray="1.5 2" opacity="0.55" />
      <line x1="40" y1="34" x2="56" y2="28" stroke={accent} strokeWidth="0.8" strokeDasharray="1.5 2" opacity="0.55" />
      <line x1="56" y1="28" x2="64" y2="40" stroke={accent} strokeWidth="0.8" strokeDasharray="1.5 2" opacity="0.55" />
      {/* 작은 별 (별자리 점) */}
      <circle cx="14" cy="32" r="1.5" fill={accent} />
      <circle cx="28" cy="26" r="1.5" fill={accent} />
      <circle cx="56" cy="28" r="1.5" fill={accent} />
      <circle cx="64" cy="40" r="1.5" fill={accent} />
      {/* 중앙 큰 별 */}
      <polygon
        points="40,42 44.5,54 57,54 47,62 50.5,74 40,67 29.5,74 33,62 23,54 35.5,54"
        fill={accent}
        opacity="0.95"
      />
      {/* 작은 별 추가 */}
      <polygon points="10,62 11.5,65 14.5,65 12,67 13,70 10,68 7,70 8,67 5.5,65 8.5,65" fill={accent} opacity="0.7" />
      <polygon points="68,72 69,74 71,74 69.5,75.5 70,77.5 68,76.5 66,77.5 66.5,75.5 65,74 67,74" fill={accent} opacity="0.55" />
      {/* 잠자는 토끼 실루엣 (하단) */}
      <ellipse cx="40" cy="92" rx="16" ry="3" fill={accent} opacity="0.45" />
      <ellipse cx="40" cy="88" rx="11" ry="3.5" fill={accent} opacity="0.6" />
      <circle cx="34" cy="85" r="3" fill={accent} opacity="0.65" />
      <ellipse cx="31" cy="80" rx="1.5" ry="3.5" fill={accent} opacity="0.55" />
      <ellipse cx="35" cy="80" rx="1.5" ry="3.5" fill={accent} opacity="0.55" />
    </g>
  );
}

function ForestMotif({ accent }: { accent: string }) {
  return (
    <g>
      {/* 하늘 구름 */}
      <ellipse cx="20" cy="26" rx="6" ry="2.5" fill={accent} opacity="0.45" />
      <ellipse cx="58" cy="22" rx="5" ry="2.2" fill={accent} opacity="0.4" />
      <ellipse cx="62" cy="20" rx="3.5" ry="1.5" fill={accent} opacity="0.4" />
      {/* 멀리 산 */}
      <path d="M0,52 Q15,40 30,50 Q50,38 65,48 Q75,42 80,50 L80,60 L0,60 Z" fill={accent} opacity="0.35" />
      {/* 나무 (좌) */}
      <polygon points="10,72 18,50 26,72" fill={accent} opacity="0.75" />
      <polygon points="12,62 18,44 24,62" fill={accent} opacity="0.85" />
      <rect x="16.5" y="72" width="3" height="6" fill={accent} opacity="0.6" />
      {/* 나무 (우) */}
      <polygon points="58,76 66,56 74,76" fill={accent} opacity="0.7" />
      <rect x="64.5" y="76" width="3" height="5" fill={accent} opacity="0.55" />
      {/* 오두막 본체 */}
      <rect x="32" y="62" width="20" height="18" fill={accent} opacity="0.95" />
      {/* 지붕 */}
      <polygon points="28,62 42,46 56,62" fill={accent} opacity="0.92" />
      {/* 굴뚝 */}
      <rect x="48" y="50" width="3" height="6" fill={accent} opacity="0.8" />
      {/* 문 */}
      <rect x="39" y="69" width="6" height="11" fill="rgba(0,0,0,0.35)" rx="1" />
      <circle cx="44" cy="74.5" r="0.7" fill={accent} />
      {/* 창문 */}
      <rect x="34" y="66" width="4" height="4" fill="rgba(255,255,255,0.55)" />
      <line x1="36" y1="66" x2="36" y2="70" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
      <line x1="34" y1="68" x2="38" y2="68" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
      {/* 굽은 길 */}
      <path d="M18,90 Q40,84 62,90" stroke={accent} strokeWidth="3.5" fill="none" opacity="0.55" strokeLinecap="round" />
      <path d="M18,90 Q40,84 62,90" stroke={accent} strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" strokeDasharray="2 2" />
    </g>
  );
}

function RabbitMotif({ accent }: { accent: string }) {
  return (
    <g>
      {/* 배경 꽃잎 패턴 */}
      <circle cx="14" cy="26" r="2.5" fill={accent} opacity="0.55" />
      <circle cx="64" cy="26" r="2" fill={accent} opacity="0.55" />
      <circle cx="10" cy="52" r="1.8" fill={accent} opacity="0.5" />
      <circle cx="68" cy="56" r="2.2" fill={accent} opacity="0.5" />
      <circle cx="18" cy="78" r="1.5" fill={accent} opacity="0.45" />
      <circle cx="62" cy="78" r="1.6" fill={accent} opacity="0.45" />
      {/* 작은 꽃 (양옆) */}
      <g opacity="0.65">
        <circle cx="14" cy="60" r="1.5" fill={accent} />
        <circle cx="12" cy="58" r="1.2" fill={accent} />
        <circle cx="16" cy="58" r="1.2" fill={accent} />
        <circle cx="12" cy="62" r="1.2" fill={accent} />
        <circle cx="16" cy="62" r="1.2" fill={accent} />
      </g>
      <g opacity="0.65">
        <circle cx="66" cy="60" r="1.5" fill={accent} />
        <circle cx="64" cy="58" r="1.2" fill={accent} />
        <circle cx="68" cy="58" r="1.2" fill={accent} />
        <circle cx="64" cy="62" r="1.2" fill={accent} />
        <circle cx="68" cy="62" r="1.2" fill={accent} />
      </g>
      {/* 토끼 몸 */}
      <ellipse cx="40" cy="72" rx="15" ry="13" fill={accent} opacity="0.97" />
      {/* 토끼 머리 */}
      <circle cx="40" cy="52" r="12" fill={accent} opacity="0.97" />
      {/* 귀 (외곽) */}
      <ellipse cx="32" cy="34" rx="4.5" ry="10" fill={accent} opacity="0.92" />
      <ellipse cx="48" cy="34" rx="4.5" ry="10" fill={accent} opacity="0.92" />
      {/* 귀 안쪽 */}
      <ellipse cx="32" cy="35" rx="2.2" ry="6.5" fill="rgba(255,150,150,0.6)" />
      <ellipse cx="48" cy="35" rx="2.2" ry="6.5" fill="rgba(255,150,150,0.6)" />
      {/* 발 */}
      <ellipse cx="32" cy="85" rx="4" ry="2.5" fill={accent} opacity="0.85" />
      <ellipse cx="48" cy="85" rx="4" ry="2.5" fill={accent} opacity="0.85" />
      {/* 눈 */}
      <circle cx="35.5" cy="52" r="1.7" fill="rgba(0,0,0,0.75)" />
      <circle cx="44.5" cy="52" r="1.7" fill="rgba(0,0,0,0.75)" />
      <circle cx="35.8" cy="51.4" r="0.6" fill="rgba(255,255,255,0.85)" />
      <circle cx="44.8" cy="51.4" r="0.6" fill="rgba(255,255,255,0.85)" />
      {/* 볼터치 */}
      <circle cx="30" cy="57" r="2" fill="rgba(255,150,150,0.55)" />
      <circle cx="50" cy="57" r="2" fill="rgba(255,150,150,0.55)" />
      {/* 코 + 입 */}
      <ellipse cx="40" cy="56.5" rx="1.5" ry="1" fill="rgba(180,100,80,0.85)" />
      <path d="M40,58 Q38,60 36,59 M40,58 Q42,60 44,59" stroke="rgba(180,100,80,0.85)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </g>
  );
}

function CarrotMotif({ accent }: { accent: string }) {
  return (
    <g>
      {/* 풀밭 */}
      <ellipse cx="40" cy="92" rx="36" ry="6" fill={accent} opacity="0.6" />
      {/* 작은 풀 */}
      <path d="M8,90 Q10,84 12,90" stroke={accent} strokeWidth="1" fill="none" opacity="0.55" />
      <path d="M70,90 Q72,85 74,90" stroke={accent} strokeWidth="1" fill="none" opacity="0.55" />
      {/* 토끼 (왼쪽) */}
      <ellipse cx="24" cy="72" rx="9" ry="8" fill="#FFFBF0" stroke="#3D2E1E" strokeWidth="1.2" opacity="0.97" />
      <circle cx="24" cy="58" r="7" fill="#FFFBF0" stroke="#3D2E1E" strokeWidth="1.2" opacity="0.97" />
      <ellipse cx="20" cy="46" rx="2.2" ry="6" fill="#FFFBF0" stroke="#3D2E1E" strokeWidth="1" opacity="0.95" />
      <ellipse cx="28" cy="46" rx="2.2" ry="6" fill="#FFFBF0" stroke="#3D2E1E" strokeWidth="1" opacity="0.95" />
      <ellipse cx="20" cy="46.5" rx="0.9" ry="3.5" fill="rgba(255,150,150,0.6)" />
      <ellipse cx="28" cy="46.5" rx="0.9" ry="3.5" fill="rgba(255,150,150,0.6)" />
      <circle cx="21.5" cy="58" r="0.9" fill="#3D2E1E" />
      <circle cx="26.5" cy="58" r="0.9" fill="#3D2E1E" />
      <ellipse cx="24" cy="61" rx="0.9" ry="0.6" fill="rgba(180,100,80,0.85)" />
      <circle cx="20" cy="60.5" r="1.3" fill="rgba(255,150,150,0.5)" />
      <circle cx="28" cy="60.5" r="1.3" fill="rgba(255,150,150,0.5)" />
      {/* 큰 당근 (오른쪽) */}
      <path
        d="M54,46 Q49,72 58,88 Q67,72 62,46 Z"
        fill="#FF8C42"
        stroke="#3D2E1E"
        strokeWidth="1.2"
        opacity="0.97"
      />
      {/* 당근 가로선 */}
      <path d="M52,58 Q52,68 55,78" stroke="rgba(200,80,0,0.55)" strokeWidth="1" fill="none" />
      <path d="M60,58 Q60,68 57,78" stroke="rgba(200,80,0,0.55)" strokeWidth="1" fill="none" />
      {/* 잎사귀 */}
      <path d="M58,46 Q50,30 46,34 Q52,40 58,46" fill={accent} opacity="0.97" />
      <path d="M58,46 Q66,30 70,34 Q64,40 58,46" fill={accent} opacity="0.97" />
      <path d="M58,46 Q54,30 54,26 Q58,34 58,46" fill={accent} opacity="0.9" />
      <path d="M58,46 Q62,30 62,26 Q58,34 58,46" fill={accent} opacity="0.9" />
    </g>
  );
}

const motifMap = {
  star: StarMotif,
  forest: ForestMotif,
  rabbit: RabbitMotif,
  carrot: CarrotMotif,
} as const;

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
