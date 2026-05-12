import type { Metadata } from "next";
import localFont from "next/font/local";
import { Gowun_Dodum } from "next/font/google";
import { Agentation } from "agentation";
import "./globals.css";
import Header from "@/components/Header";
import TabBar from "@/components/TabBar";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

const gowunDodum = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gowun",
  display: "swap",
});

export const metadata: Metadata = {
  title: "토키 - 나만의 이야기 만들기",
  description: "아이들을 위한 AI 동화책 만들기 앱. 오늘은 어떤 이야기를 만들까요?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${gowunDodum.variable}`}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body>
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            minHeight: "100dvh",
            backgroundColor: "var(--color-beige)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 30,
              backgroundColor: "transparent",
            }}
          >
            <Header />
          </div>
          {children}
        </div>
        <TabBar />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
