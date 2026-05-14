/**
 * 펠트 질감 SVG 필터 컴포넌트.
 * <defs> 안에서 사용하며, 다른 요소에서 filter="url(#<id>)" 로 참조한다.
 *
 * @param id      필터 id (참조 시 일치해야 함)
 * @param tight   true이면 x/y 오프셋 없이 100% 크기로, false(기본)이면 5% 여백 포함 110% 크기로 렌더
 */
export default function FeltFilter({
  id,
  tight = false,
}: {
  id: string;
  tight?: boolean;
}) {
  const x = tight ? "0%" : "-5%";
  const y = tight ? "0%" : "-5%";
  const w = tight ? "100%" : "110%";
  const h = tight ? "100%" : "110%";

  return (
    <filter id={id} x={x} y={y} width={w} height={h}>
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.85"
        numOctaves="2"
        stitchTiles="stitch"
        result="noise"
      />
      <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
      <feComponentTransfer in="grayNoise" result="alphaNoise">
        <feFuncA type="linear" slope="0.35" intercept="0" />
      </feComponentTransfer>
      <feComposite
        in="alphaNoise"
        in2="SourceGraphic"
        operator="in"
        result="textured"
      />
      <feBlend in="SourceGraphic" in2="textured" mode="multiply" />
    </filter>
  );
}
