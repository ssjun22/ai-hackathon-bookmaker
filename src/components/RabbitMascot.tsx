"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useAnimationControls,
  AnimatePresence,
} from "framer-motion";
import { useState } from "react";

type Particle = {
  id: number;
  sx: number;
  sy: number;
  dx: number;
  dy: number;
  rotate: number;
  src: string;
};

let particleSeq = 0;
const STAR_SOURCES = ["/ui/star.png", "/ui/star_red.png", "/ui/star_br.png"];

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle =
      (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
    const startDist = 65 + Math.random() * 25;
    const endDist = startDist + 70 + Math.random() * 50;
    return {
      id: ++particleSeq,
      sx: Math.cos(angle) * startDist,
      sy: Math.sin(angle) * startDist - 15,
      dx: Math.cos(angle) * endDist,
      dy: Math.sin(angle) * endDist - 35,
      rotate: (Math.random() - 0.5) * 540,
      src: STAR_SOURCES[Math.floor(Math.random() * STAR_SOURCES.length)],
    };
  });
}

export default function RabbitMascot() {
  const reduceMotion = useReducedMotion();
  const controls = useAnimationControls();
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleTap = () => {
    if (reduceMotion) return;
    controls.start({
      y: [0, -32, 0],
      scaleY: [1, 0.9, 1.08, 1],
      scaleX: [1, 1.08, 0.94, 1],
      transition: {
        duration: 0.55,
        ease: "easeOut",
        times: [0, 0.25, 0.7, 1],
      },
    });
    const newParticles = makeParticles(8);
    setParticles((prev) => [...prev, ...newParticles]);
    const ids = new Set(newParticles.map((p) => p.id));
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !ids.has(p.id)));
    }, 950);
  };

  return (
    <motion.div
      animate={
        reduceMotion
          ? undefined
          : {
              y: [100, 92, 100],
              rotate: [-1.5, 1.5, -1.5],
              scale: [1, 1.03, 1],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : {
              y: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 3.8, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
            }
      }
      style={{
        width: "92%",
        maxWidth: 380,
        marginLeft: "auto",
        marginRight: "auto",
        transformOrigin: "bottom center",
        filter: "drop-shadow(0 6px 8px rgba(120,90,50,0.20))",
        position: "relative",
      }}
    >
      <motion.button
        type="button"
        onClick={handleTap}
        whileTap={{ scale: 0.94 }}
        animate={controls}
        aria-label="토키 토닥토닥"
        style={{
          display: "block",
          width: "100%",
          padding: 0,
          background: "none",
          border: "none",
          cursor: "pointer",
          transformOrigin: "bottom center",
        }}
      >
        <Image
          src="/toki/1.png"
          alt="토키 마스코트"
          width={380}
          height={380}
          className="w-full h-auto"
          priority
          draggable={false}
        />
      </motion.button>

      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.sx, y: p.sy, opacity: 1, rotate: 0, scale: 0.7 }}
            animate={{
              x: p.dx,
              y: p.dy,
              opacity: 0,
              rotate: p.rotate,
              scale: 1.3,
            }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: "50%",
              top: "32%",
              width: 32,
              height: 32,
              marginLeft: -16,
              marginTop: -16,
              pointerEvents: "none",
              zIndex: 5,
            }}
          >
            <Image
              src={p.src}
              alt=""
              width={32}
              height={32}
              draggable={false}
              style={{ display: "block" }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
