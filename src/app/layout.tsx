import type { Metadata } from "next";
import localFont from "next/font/local";
import { Gowun_Dodum } from "next/font/google";
import "./globals.css";
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
        {children}
        <TabBar />
      </body>
    </html>
  );
}
