"use client";

import { Group } from "@visx/group";
import { motion } from "motion/react";
import { createParticleFieldNodes } from "@/components/science-scenes/sceneMath";

type ParticleFieldProps = {
  reduceMotion: boolean;
  seed?: number;
};

export function ParticleField({ reduceMotion, seed = 13 }: ParticleFieldProps) {
  const particles = createParticleFieldNodes({
    count: 12,
    width: 320,
    height: 210,
    seed,
  });

  return (
    <svg
      viewBox="0 0 320 210"
      className="h-full w-full"
      role="img"
      aria-label="Subtle deterministic particle field"
    >
      <Group>
        <motion.path
          d="M35 144 C82 86, 124 158, 174 99 S249 70, 284 126"
          fill="none"
          stroke="#d3e7e5"
          strokeWidth={3}
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0.35 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 1.1, ease: "easeOut" }}
        />
        <circle cx={246} cy={132} r={29} fill="#fff4dd" opacity={0.72} />
        <circle cx={246} cy={132} r={10} fill="#c78320" opacity={0.62} />
        {particles.map((particle, index) => (
          <motion.circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particle.radius}
            fill={particle.fill}
            initial={
              reduceMotion
                ? false
                : {
                    x: -particle.driftX * 0.4,
                    y: 8,
                    opacity: 0,
                  }
            }
            animate={{ x: 0, y: 0, opacity: particle.opacity }}
            transition={{
              duration: reduceMotion ? 0 : 0.42,
              delay: index * 0.035,
              ease: "easeOut",
            }}
          />
        ))}
        <text x={160} y={184} textAnchor="middle" fontSize={11} fill="#64727c">
          energy and matter in motion
        </text>
      </Group>
    </svg>
  );
}
