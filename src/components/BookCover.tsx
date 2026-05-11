// 정적 서버 컴포넌트 — framer-motion 미사용

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
    <g>
      {/* 점선 별자리 */}
      <line x1="14" y1="20" x2="28" y2="14" stroke={accent} strokeWidth="0.8" strokeDasharray="1.5 2" opacity="0.6" />
      <line x1="28" y1="14" x2="40" y2="22" stroke={accent} strokeWidth="0.8" strokeDasharray="1.5 2" opacity="0.6" />
      <line x1="40" y1="22" x2="56" y2="16" stroke={accent} strokeWidth="0.8" strokeDasharray="1.5 2" opacity="0.6" />
      <line x1="56" y1="16" x2="64" y2="28" stroke={accent} strokeWidth="0.8" strokeDasharray="1.5 2" opacity="0.6" />
      {/* 작은 별 (별자리 점) */}
      <circle cx="14" cy="20" r="1.5" fill={accent} />
      <circle cx="28" cy="14" r="1.5" fill={accent} />
      <circle cx="56" cy="16" r="1.5" fill={accent} />
      <circle cx="64" cy="28" r="1.5" fill={accent} />
      {/* 큰 중앙 별 */}
      <polygon
        points="40,28 44.5,40 57,40 47,48 50.5,60 40,53 29.5,60 33,48 23,40 35.5,40"
        fill={accent}
        opacity="0.95"
      />
      {/* 잠자는 토끼 실루엣 (간단) */}
      <ellipse cx="40" cy="72" rx="14" ry="3.5" fill={accent} opacity="0.55" />
      <ellipse cx="40" cy="69" rx="10" ry="2.8" fill={accent} opacity="0.5" />
      <ellipse cx="33" cy="66" rx="2" ry="3.5" fill={accent} opacity="0.5" />
      <ellipse cx="36" cy="66" rx="2" ry="3.5" fill={accent} opacity="0.5" />
      {/* 작은 별 추가 */}
      <polygon points="10,50 11.5,53 14.5,53 12,55 13,58 10,56 7,58 8,55 5.5,53 8.5,53" fill={accent} opacity="0.7" />
      <polygon points="68,60 69,62 71,62 69.5,63.5 70,65.5 68,64.5 66,65.5 66.5,63.5 65,62 67,62" fill={accent} opacity="0.55" />
    </g>
  );
}

function ForestMotif({ accent }: { accent: string }) {
  return (
    <g>
      {/* 하늘 점 (구름 느낌) */}
      <ellipse cx="58" cy="14" rx="6" ry="2.5" fill={accent} opacity="0.35" />
      <ellipse cx="62" cy="12" rx="4" ry="1.8" fill={accent} opacity="0.35" />
      {/* 나무 (좌) */}
      <polygon points="14,58 22,36 30,58" fill={accent} opacity="0.7" />
      <polygon points="16,48 22,30 28,48" fill={accent} opacity="0.8" />
      <rect x="20.5" y="58" width="3" height="6" fill={accent} opacity="0.6" />
      {/* 나무 (우) */}
      <polygon points="56,60 64,42 72,60" fill={accent} opacity="0.65" />
      <rect x="62.5" y="60" width="3" height="5" fill={accent} opacity="0.55" />
      {/* 오두막 본체 */}
      <rect x="32" y="48" width="20" height="18" fill={accent} opacity="0.92" />
      {/* 지붕 */}
      <polygon points="28,48 42,32 56,48" fill={accent} opacity="0.85" />
      {/* 굴뚝 */}
      <rect x="48" y="36" width="3" height="6" fill={accent} opacity="0.8" />
      {/* 문 */}
      <rect x="39" y="55" width="6" height="11" fill="rgba(0,0,0,0.30)" rx="1" />
      <circle cx="44" cy="60.5" r="0.6" fill={accent} />
      {/* 창문 */}
      <rect x="34" y="52" width="4" height="4" fill="rgba(255,255,255,0.5)" />
      <line x1="36" y1="52" x2="36" y2="56" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
      <line x1="34" y1="54" x2="38" y2="54" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
      {/* 굽은 길 */}
      <path d="M22,72 Q40,68 60,72" stroke={accent} strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round" strokeDasharray="2 1.5" />
    </g>
  );
}

function RabbitMotif({ accent }: { accent: string }) {
  return (
    <g>
      {/* 배경 꽃잎 패턴 */}
      <circle cx="14" cy="14" r="2.5" fill={accent} opacity="0.55" />
      <circle cx="64" cy="14" r="2" fill={accent} opacity="0.55" />
      <circle cx="10" cy="40" r="1.8" fill={accent} opacity="0.5" />
      <circle cx="68" cy="44" r="2.2" fill={accent} opacity="0.5" />
      <circle cx="18" cy="62" r="1.5" fill={accent} opacity="0.45" />
      <circle cx="62" cy="62" r="1.6" fill={accent} opacity="0.45" />
      {/* 하트 별 작게 */}
      <path d="M20,30 Q19,28 17,29 Q15,28 15,30 Q15,32 18,34 Q21,32 21,30 Q21,28 20,30 Z" fill={accent} opacity="0.55" />
      <path d="M60,30 Q59,28 57,29 Q55,28 55,30 Q55,32 58,34 Q61,32 61,30 Q61,28 60,30 Z" fill={accent} opacity="0.55" />
      {/* 토끼 몸 */}
      <ellipse cx="40" cy="55" rx="15" ry="13" fill={accent} opacity="0.95" />
      {/* 토끼 머리 */}
      <circle cx="40" cy="36" r="12" fill={accent} opacity="0.95" />
      {/* 귀 (외곽) */}
      <ellipse cx="32" cy="18" rx="4.5" ry="10" fill={accent} opacity="0.9" />
      <ellipse cx="48" cy="18" rx="4.5" ry="10" fill={accent} opacity="0.9" />
      {/* 귀 안쪽 */}
      <ellipse cx="32" cy="19" rx="2.2" ry="6.5" fill="rgba(255,150,150,0.55)" />
      <ellipse cx="48" cy="19" rx="2.2" ry="6.5" fill="rgba(255,150,150,0.55)" />
      {/* 발 */}
      <ellipse cx="32" cy="68" rx="4" ry="2.5" fill={accent} opacity="0.85" />
      <ellipse cx="48" cy="68" rx="4" ry="2.5" fill={accent} opacity="0.85" />
      {/* 눈 */}
      <circle cx="35.5" cy="36" r="1.7" fill="rgba(0,0,0,0.7)" />
      <circle cx="44.5" cy="36" r="1.7" fill="rgba(0,0,0,0.7)" />
      <circle cx="35.8" cy="35.4" r="0.6" fill="rgba(255,255,255,0.8)" />
      <circle cx="44.8" cy="35.4" r="0.6" fill="rgba(255,255,255,0.8)" />
      {/* 볼터치 */}
      <circle cx="30" cy="41" r="2" fill="rgba(255,150,150,0.5)" />
      <circle cx="50" cy="41" r="2" fill="rgba(255,150,150,0.5)" />
      {/* 코 + 입 */}
      <ellipse cx="40" cy="40.5" rx="1.5" ry="1" fill="rgba(180,100,80,0.8)" />
      <path d="M40,42 Q38,44 36,43 M40,42 Q42,44 44,43" stroke="rgba(180,100,80,0.8)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </g>
  );
}

function CarrotMotif({ accent }: { accent: string }) {
  return (
    <g>
      {/* 풀밭 */}
      <ellipse cx="40" cy="76" rx="36" ry="6" fill={accent} opacity="0.55" />
      {/* 작은 토끼 (왼쪽) */}
      <ellipse cx="22" cy="56" rx="8" ry="7" fill="#FFFBF0" stroke="#3D2E1E" strokeWidth="1" opacity="0.95" />
      <circle cx="22" cy="44" r="6" fill="#FFFBF0" stroke="#3D2E1E" strokeWidth="1" opacity="0.95" />
      <ellipse cx="18" cy="34" rx="2" ry="5" fill="#FFFBF0" stroke="#3D2E1E" strokeWidth="0.8" opacity="0.9" />
      <ellipse cx="26" cy="34" rx="2" ry="5" fill="#FFFBF0" stroke="#3D2E1E" strokeWidth="0.8" opacity="0.9" />
      <circle cx="20" cy="44" r="0.8" fill="#3D2E1E" />
      <circle cx="24" cy="44" r="0.8" fill="#3D2E1E" />
      <ellipse cx="22" cy="47" rx="0.8" ry="0.5" fill="rgba(180,100,80,0.8)" />
      <circle cx="18.5" cy="46.5" r="1.2" fill="rgba(255,150,150,0.4)" />
      <circle cx="25.5" cy="46.5" r="1.2" fill="rgba(255,150,150,0.4)" />
      {/* 큰 당근 (오른쪽) */}
      <path
        d="M52,32 Q47,55 56,72 Q65,55 60,32 Z"
        fill="#FF8C42"
        stroke="#3D2E1E"
        strokeWidth="1"
        opacity="0.95"
      />
      {/* 당근 가로선 */}
      <path d="M50.5,42 Q50,52 53,62" stroke="rgba(200,80,0,0.5)" strokeWidth="1" fill="none" />
      <path d="M58.5,42 Q59,52 56,62" stroke="rgba(200,80,0,0.5)" strokeWidth="1" fill="none" />
      {/* 잎사귀 */}
      <path d="M56,32 Q48,18 44,22 Q50,26 56,32" fill={accent} opacity="0.95" />
      <path d="M56,32 Q64,16 68,20 Q62,26 56,32" fill={accent} opacity="0.95" />
      <path d="M56,32 Q52,16 52,12 Q56,20 56,32" fill={accent} opacity="0.85" />
      <path d="M56,32 Q60,16 60,12 Q56,20 56,32" fill={accent} opacity="0.85" />
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

  return (
    <div
      style={{
        width,
        height,
        borderRadius: "var(--radius-clay-sm)",
        overflow: "hidden",
        backgroundColor: palette.bg,
        boxShadow: "var(--shadow-clay)",
        border: "var(--border-clay)",
        flexShrink: 0,
        position: "relative",
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
          {/* 펠트 노이즈 필터 — 강화된 파라미터 */}
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feComponentTransfer in="grayNoise" result="alphaNoise">
              <feFuncA type="linear" slope="0.5" intercept="0" />
            </feComponentTransfer>
            <feComposite in="alphaNoise" in2="SourceGraphic" operator="in" result="textured" />
            <feBlend in="SourceGraphic" in2="textured" mode="multiply" />
          </filter>
        </defs>

        {/* 모티프 영역 (펠트 노이즈 적용) */}
        <g filter={`url(#${filterId})`}>
          <Motif accent={palette.accent} />
        </g>

        {/* 제목 영역 — 살짝 어두운 띠 */}
        <rect x="0" y="82" width="80" height="26" fill="rgba(0,0,0,0.12)" />
        <text
          x="40"
          y="98"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill={palette.accent}
          style={{ fontFamily: "var(--font-gowun), system-ui" }}
        >
          {title}
        </text>
      </svg>
    </div>
  );
}
