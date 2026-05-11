import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "토키 - 나만의 이야기 만들기",
  description: "아이들을 위한 AI 동화책 만들기 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
