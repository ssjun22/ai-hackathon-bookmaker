"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
  {
    href: "/",
    label: "홈",
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={active ? "var(--color-green-deep)" : "none"}
        stroke={active ? "var(--color-green-deep)" : "var(--color-brown-soft)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/library",
    label: "나의 서재",
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "var(--color-green-deep)" : "var(--color-brown-soft)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    href: "/me",
    label: "내 정보",
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "var(--color-green-deep)" : "var(--color-brown-soft)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
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

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center"
      style={{
        backgroundColor: "var(--color-card)",
        boxShadow: "0 -2px 10px rgba(120,90,50,0.08)",
        paddingTop: 10,
        paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {tabs.map((tab) => {
        const active = isActive(tab.href, pathname);
        return (
          <motion.div key={tab.href} whileTap={{ scale: 0.9 }}>
            <Link
              href={tab.href}
              className="flex flex-col items-center gap-1"
              style={{ textDecoration: "none", minWidth: 60 }}
            >
              {tab.icon(active)}
              <span
                className="text-xs font-medium"
                style={{
                  color: active
                    ? "var(--color-green-deep)"
                    : "var(--color-brown-soft)",
                }}
              >
                {tab.label}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}
