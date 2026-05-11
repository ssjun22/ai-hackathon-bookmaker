"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import RabbitMascot from "./RabbitMascot";

export default function Hero() {
  return (
    <motion.section
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--color-beige-soft)",
        minHeight: 280,
      }}
    >
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <Image
          src="/toki/bg.png"
          alt="펠트 배경"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* 마스코트 오버레이 */}
      <div className="relative z-10 flex justify-center items-end px-4 pb-2 pt-4">
        <RabbitMascot />
      </div>
    </motion.section>
  );
}
