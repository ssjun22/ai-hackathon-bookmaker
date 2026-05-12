"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Tab = {
  href: string;
  label: string;
  renderIcon: (active: boolean) => ReactNode;
};

const tabs: Tab[] = [
  {
    href: "/",
    label: "홈",
    renderIcon: (active) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "var(--color-green-deep)" : "var(--color-brown-soft)"}
        strokeWidth={active ? 2.4 : 2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/library",
    label: "나의 서재",
    renderIcon: (active) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "var(--color-green-deep)" : "var(--color-brown-soft)"}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    href: "/me",
    label: "내 정보",
    renderIcon: (active) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "var(--color-green-deep)" : "var(--color-brown-soft)"}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function TabBar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center"
      style={{
        zIndex: 50,
        backgroundColor: "var(--color-card)",
        boxShadow: "0 -8px 24px rgba(120,90,50,0.12), 0 -2px 4px rgba(120,90,50,0.08)",
        paddingTop: 10,
        paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
        maxWidth: 480,
        marginLeft: "auto",
        marginRight: "auto",
        borderTopLeftRadius: "var(--radius-clay)",
        borderTopRightRadius: "var(--radius-clay)",
      }}
    >
      {tabs.map((tab) => {
        const active = isActive(tab.href, pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            aria-label={tab.label}
            className="flex flex-col items-center justify-center focus-visible:outline-none"
            style={{
              textDecoration: "none",
              minWidth: 64,
              minHeight: 48,
              padding: "6px 14px",
              gap: 3,
            }}
          >
            {/* 아이콘 + active pill */}
            <div
              style={{
                position: "relative",
                width: 44,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {active && (
                <motion.span
                  layoutId="tabbar-active-pill"
                  initial={false}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 30 }
                  }
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(118, 176, 72, 0.16)",
                    borderRadius: 14,
                  }}
                  aria-hidden="true"
                />
              )}
              <span style={{ position: "relative", zIndex: 1, display: "inline-flex" }}>
                {tab.renderIcon(active)}
              </span>
            </div>
            <span
              className="text-xs"
              style={{
                fontWeight: active ? 700 : 500,
                color: active
                  ? "var(--color-green-deep)"
                  : "var(--color-brown-soft)",
              }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
