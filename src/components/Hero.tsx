"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import RabbitMascot from "./RabbitMascot";
import RabbitSpeech from "./RabbitSpeech";

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
        height: 320,
        marginTop: 8,
        marginBottom: 20,
        marginLeft: 16,
        marginRight: 16,
        borderRadius: "var(--radius-clay)",
        boxShadow: "var(--shadow-clay)",
      }}
    >
      {/* 배경 이미지 (책장·창문·식물 디오라마) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/toki/bg.png"
          alt="펠트 디오라마 배경"
          fill
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover object-center"
          priority
        />
      </div>

      {/* 마스코트 (중간 레이어) */}
      <div
        className="absolute inset-0 z-10 flex justify-center items-end"
        style={{
          paddingTop: 20,
          paddingBottom: 0,
          paddingLeft: 12,
          paddingRight: 12,
        }}
      >
        <RabbitMascot />
      </div>

      {/* 로고 — 토끼 우측 하단 */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{
          right: 12,
          bottom: 8,
          width: 88,
        }}
      >
        <Image
          src="/ui/logo.png"
          alt="북적북적"
          width={88}
          height={70}
          style={{ width: "100%", height: "auto", display: "block" }}
          priority
        />
      </div>

      {/* 토끼 말풍선 — 최상단 레이어 */}
      <RabbitSpeech />
    </motion.section>
  );
}
