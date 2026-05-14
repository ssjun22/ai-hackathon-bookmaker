"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

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
  image: string;
  bg: string;
  desc: string;
}[] = [
  {
    href: "/library",
    label: "책 읽기",
    image: "/ui/book.png",
    bg: "var(--color-green)",
    desc: "재미있는 이야기를 읽어요",
  },
  {
    href: "/create",
    label: "나만의 책만들기",
    image: "/ui/book2.png",
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
                  minHeight: 168,
                  padding: "22px 14px 18px",
                  color: "var(--color-brown)",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 84,
                    height: 84,
                    marginBottom: 10,
                  }}
                >
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="84px"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <p
                  className="font-display leading-tight"
                  style={{ fontSize: 20, marginBottom: 6, fontWeight: 700 }}
                >
                  {card.label}
                </p>
                <p
                  className="leading-snug whitespace-pre-line"
                  style={{ color: "var(--color-brown-soft)", fontSize: 14 }}
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
