"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { y: 16, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const cards = [
  {
    href: "/read",
    label: "책 읽기",
    emoji: "📖",
    bg: "var(--color-green)",
    desc: "재미있는 이야기를\n같이 읽어봐요",
  },
  {
    href: "/create",
    label: "생각 만들기",
    emoji: "✨",
    bg: "var(--color-yellow)",
    desc: "나만의 이야기를\n만들어봐요",
  },
];

export default function CtaCards() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="px-5 py-4"
    >
      <div className="flex gap-3">
        {cards.map((card) => (
          <motion.div
            key={card.href}
            variants={cardVariants}
            whileTap={{ scale: 0.96 }}
            className="flex-1"
          >
            <Link
              href={card.href}
              className="block h-full"
              style={{ textDecoration: "none" }}
            >
              <div
                className="flex flex-col items-center justify-center py-5 px-3 text-center"
                style={{
                  backgroundColor: card.bg,
                  borderRadius: "var(--radius-felt)",
                  boxShadow: "var(--shadow-felt)",
                  minHeight: 120,
                  color: "var(--color-brown)",
                }}
              >
                <span className="text-3xl mb-2">{card.emoji}</span>
                <p className="text-base font-bold leading-tight mb-1">
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
