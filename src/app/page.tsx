import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CtaCards from "@/components/CtaCards";
import Bookshelf from "@/components/Bookshelf";

export default function Home() {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        minHeight: "100dvh",
        backgroundColor: "var(--color-beige)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        zIndex: 2,
      }}
    >
      {/* 헤더 */}
      <Header />

      {/* 스크롤 가능 콘텐츠 영역 */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: "calc(80px + env(safe-area-inset-bottom))",
        }}
      >
        {/* 히어로 */}
        <Hero />

        {/* CTA 카드 */}
        <CtaCards />

        {/* 내 서재 */}
        <Bookshelf />
      </div>
    </div>
  );
}
