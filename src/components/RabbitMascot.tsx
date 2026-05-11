"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function RabbitMascot() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={reduceMotion ? undefined : { scale: [1, 1.04, 1] }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
      }
      style={{
        width: "78%",
        maxWidth: 260,
        margin: "0 auto",
        transformOrigin: "bottom center",
        filter: "drop-shadow(0 6px 8px rgba(120,90,50,0.20))",
      }}
    >
      <Image
        src="/toki/1.png"
        alt="토키 마스코트"
        width={260}
        height={260}
        className="w-full h-auto"
        priority
      />
    </motion.div>
  );
}
