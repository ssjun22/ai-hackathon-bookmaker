"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import RabbitMascot from "./RabbitMascot";

// Header 높이: paddingTop(14 + safe-area) + 아바타(48) + paddingBottom(14)
const HEADER_OFFSET = "calc(76px + env(safe-area-inset-top))";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { scale: 0.94, opacity: 0 }}
      animate={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
      transition={
        reduceMotion
          ? undefined
          : { type: "spring", stiffness: 160, damping: 18, delay: 0.1 }
      }
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--color-beige)",
        aspectRatio: "1 / 1",
        marginTop: `calc(-1 * ${HEADER_OFFSET})`,
        marginBottom: 16,
      }}
    >
      {/* 배경 이미지 (책장·창문·식물 디오라마) — viewport 최상단부터 */}
      <div className="absolute inset-0">
        <Image
          src="/toki/bg.png"
          alt="펠트 디오라마 배경"
          fill
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover object-center"
          priority
        />
      </div>

      {/* 마스코트 오버레이 — Header 영역만큼 padding으로 밀어 원래 위치 보존 */}
      <div
        className="absolute inset-0 z-10 flex justify-center items-end"
        style={{
          paddingTop: `calc(${HEADER_OFFSET} + 20px)`,
          paddingBottom: 0,
          paddingLeft: 12,
          paddingRight: 12,
        }}
      >
        <RabbitMascot />
      </div>
    </motion.section>
  );
}
