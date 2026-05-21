"use client";

import { Group } from "@visx/group";
import { motion } from "motion/react";
import {
  createEntropyParticles,
  formatSignedSceneNumber,
  toneColor,
  type EntropyParticle,
  type EntropySceneData,
} from "@/components/science-scenes/sceneMath";

type EntropyParticleSceneProps = EntropySceneData & {
  reduceMotion: boolean;
};

const particleWidth = 230;
const particleHeight = 170;
const orderedCenterX = particleWidth * 0.31;
const particleCenterY = particleHeight * 0.52;

function ParticleState({
  particles,
  count,
  centerX,
  centerY,
  mode,
  emphasize,
  reduceMotion,
}: {
  particles: EntropyParticle[];
  count: number;
  centerX: number;
  centerY: number;
  mode: "ordered" | "dispersed";
  emphasize: boolean;
  reduceMotion: boolean;
}) {
  return (
    <Group>
      {particles.slice(0, count).map((particle, index) => {
        const baseX =
          mode === "ordered"
            ? particle.orderedX - orderedCenterX
            : particle.dispersedX - particleWidth / 2;
        const baseY =
          mode === "ordered"
            ? particle.orderedY - particleCenterY
            : particle.dispersedY - particleHeight / 2;

        return (
          <motion.circle
            key={`${particle.id}-${mode}`}
            cx={centerX + baseX}
            cy={centerY + baseY}
            r={particle.radius * 1.18}
            fill={toneColor(particle.tone)}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.82 }}
            animate={{ opacity: emphasize ? 0.84 : 0.5, scale: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 0.28,
              delay: index * 0.025,
              ease: "easeOut",
            }}
          />
        );
      })}
    </Group>
  );
}

export function EntropyParticleScene({
  entropyChange,
  reactantParticles,
  productParticles,
  reduceMotion,
}: EntropyParticleSceneProps) {
  const particles = createEntropyParticles({
    count: Math.max(reactantParticles, productParticles, 7),
    width: particleWidth,
    height: particleHeight,
    seed: 31 + reactantParticles * 7 + productParticles * 11,
  });
  const dispersalIncreases = entropyChange >= 0;
  const reactantMode = dispersalIncreases ? "ordered" : "dispersed";
  const productMode = dispersalIncreases ? "dispersed" : "ordered";
  const tone = entropyChange >= 0 ? "teal" : "blue";

  return (
    <svg
      viewBox="0 0 720 190"
      className="h-full w-full overflow-visible"
      role="img"
      aria-label="Entropy particle dispersal visualization"
    >
      <Group>
        <text x={205} y={20} textAnchor="middle" fontSize={15} fill="#64727c">
          reactants
        </text>
        <text x={515} y={20} textAnchor="middle" fontSize={15} fill="#64727c">
          products
        </text>

        <ellipse
          cx={205}
          cy={86}
          rx={108}
          ry={54}
          fill="none"
          stroke="#dbe5e9"
          strokeWidth={2}
          strokeDasharray="5 8"
        />
        <ellipse
          cx={515}
          cy={86}
          rx={108}
          ry={54}
          fill="none"
          stroke="#dbe5e9"
          strokeWidth={2}
          strokeDasharray="5 8"
        />

        <ParticleState
          particles={particles}
          count={reactantParticles}
          centerX={205}
          centerY={86}
          mode={reactantMode}
          emphasize={false}
          reduceMotion={reduceMotion}
        />
        <ParticleState
          particles={particles}
          count={productParticles}
          centerX={515}
          centerY={86}
          mode={productMode}
          emphasize
          reduceMotion={reduceMotion}
        />

        <motion.path
          d="M334 86 C350 66, 370 66, 386 86"
          fill="none"
          stroke={toneColor(tone)}
          strokeWidth={4}
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.42, delay: 0.18, ease: "easeOut" }}
        />
        <path
          d="M376 76 L388 86 L376 96"
          fill="none"
          stroke={toneColor(tone)}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <text x={205} y={154} textAnchor="middle" fontSize={14} fill="#64727c">
          {reactantMode === "ordered" ? "ordered state" : "dispersed state"}
        </text>
        <text x={515} y={154} textAnchor="middle" fontSize={14} fill="#64727c">
          {productMode === "dispersed" ? "dispersed state" : "ordered state"}
        </text>

        <motion.text
          x={360}
          y={176}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={20}
          fontWeight={650}
          fill="#172026"
          initial={reduceMotion ? false : { opacity: 0, y: 184 }}
          animate={{ opacity: 1, y: 176 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, delay: 0.36, ease: "easeOut" }}
        >
          {`ΔS = ${formatSignedSceneNumber(entropyChange)} J mol⁻¹ K⁻¹`}
        </motion.text>
      </Group>
    </svg>
  );
}
