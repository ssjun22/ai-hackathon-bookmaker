"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface BookSpineProps {
  title: string;
  spineImage: string;
  onClick?: () => void;
  layoutId?: string;
  width?: number;
  height?: number;
}

export default function BookSpine({
  title,
  spineImage,
  onClick,
  layoutId,
  width = 50,
  height = 310,
}: BookSpineProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      layoutId={layoutId}
      onClick={onClick}
      whileHover={reduceMotion ? undefined : { y: -8, transition: { duration: 0.2 } }}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      aria-label={`${title} 읽기`}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-600"
      style={{
        position: "relative",
        display: "block",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        flexShrink: 0,
        width,
        height,
      }}
    >
      <Image
        src={spineImage}
        alt={title}
        fill
        sizes={`${width}px`}
        style={{ objectFit: "contain", objectPosition: "center bottom" }}
        priority
        draggable={false}
      />
    </motion.button>
  );
}
