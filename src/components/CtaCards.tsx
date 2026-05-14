"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { BookIcon, NoteIcon } from "@/components/CtaIcons";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { y: 18, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const cards: {
  href: string;
  label: string;
  icon: ReactNode;
  bg: string;
  desc: string;
}[] = [
  {
    href: "/library",
    label: "책 읽기",
    icon: <BookIcon />,
    bg: "var(--color-green)",
    desc: "재미있는 이야기를 읽어요",
  },
  {
    href: "/create",
    label: "생각 만들기",
    icon: <NoteIcon />,
    bg: "var(--color-yellow)",
    desc: "내 생각으로 이야기를 만들어요",
  },
];

export default function CtaCards() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      variants={reduceMotion ? undefined : containerVariants}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
      className="py-5"
      style={{ marginBottom: 20, marginLeft: 16, marginRight: 16 }}
    >
      <div className="flex gap-3">
        {cards.map((card) => (
          <motion.div
            key={card.href}
            variants={reduceMotion ? undefined : cardVariants}
            whileTap={reduceMotion ? undefined : { scale: 0.93 }}
            className="flex-1"
          >
            <Link
              href={card.href}
              className="block h-full focus-visible:outline-none"
              style={{ textDecoration: "none" }}
              aria-label={card.label}
            >
              <div
                className="flex flex-col items-center justify-center text-center"
                style={{
                  backgroundColor: card.bg,
                  borderRadius: "var(--radius-clay)",
                  boxShadow: "var(--shadow-clay)",
                  border: "var(--border-clay)",
                  minHeight: 168,
                  padding: "22px 14px 18px",
                  color: "var(--color-brown)",
                }}
              >
                <div style={{ marginBottom: 10 }}>{card.icon}</div>
                <p
                  className="font-display leading-tight"
                  style={{ fontSize: 17, marginBottom: 4, fontWeight: 700 }}
                >
                  {card.label}
                </p>
                <p
                  className="text-xs leading-snug whitespace-pre-line"
                  style={{ color: "var(--color-brown-soft)" }}
                >
                  {card.desc}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
