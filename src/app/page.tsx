import Hero from "@/components/Hero";
import CtaCards from "@/components/CtaCards";
import Bookshelf from "@/components/Bookshelf";

export default function Home() {
  return (
    <main
      style={{
        paddingBottom: "calc(80px + env(safe-area-inset-bottom))",
      }}
    >
      <Hero />
      <CtaCards />
      <Bookshelf />
    </main>
  );
}
