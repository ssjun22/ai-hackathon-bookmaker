"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function RabbitMascot() {
  return (
    <motion.div
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
      style={{ width: "100%", maxWidth: 320, margin: "0 auto" }}
    >
      <Image
        src="/toki/1.png"
        alt="토키 마스코트"
        width={320}
        height={320}
        className="w-full h-auto"
        priority
      />
    </motion.div>
  );
}
