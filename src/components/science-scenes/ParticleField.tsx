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
    count: 18,
    width: 720,
    height: 190,
    seed,
  });

  return (
    <svg
      viewBox="0 0 720 190"
      className="h-full w-full overflow-visible"
      role="img"
      aria-label="Subtle deterministic particle field"
    >
      <Group>
        <motion.path
          d="M72 142 C154 54, 235 152, 335 88 S536 50, 648 126"
          fill="none"
          stroke="#d3e7e5"
          strokeWidth={5}
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0.35 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 1.05, ease: "easeOut" }}
        />
        <circle cx={548} cy={126} r={34} fill="#fff4dd" opacity={0.7} />
        <circle cx={548} cy={126} r={12} fill="#c78320" opacity={0.62} />
        {particles.map((particle, index) => (
          <motion.circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particle.radius * 1.12}
            fill={particle.fill}
            initial={
              reduceMotion
                ? false
                : {
                    y: 8,
                    opacity: 0,
                  }
            }
            animate={{ y: 0, opacity: particle.opacity }}
            transition={{
              duration: reduceMotion ? 0 : 0.42,
              delay: index * 0.025,
              ease: "easeOut",
            }}
          />
        ))}
        <text x={360} y={168} textAnchor="middle" fontSize={16} fill="#64727c">
          energy and matter in motion
        </text>
      </Group>
    </svg>
  );
}
