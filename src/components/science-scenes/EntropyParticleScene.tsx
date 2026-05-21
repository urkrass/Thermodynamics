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

const width = 360;
const height = 260;

function ParticleState({
  particles,
  count,
  xOffset,
  mode,
  emphasize,
  reduceMotion,
}: {
  particles: EntropyParticle[];
  count: number;
  xOffset: number;
  mode: "ordered" | "dispersed";
  emphasize: boolean;
  reduceMotion: boolean;
}) {
  return (
    <Group>
      {particles.slice(0, count).map((particle, index) => {
        const cx =
          xOffset + (mode === "ordered" ? particle.orderedX * 0.45 : particle.dispersedX * 0.45);
        const cy = mode === "ordered" ? particle.orderedY * 0.6 + 40 : particle.dispersedY * 0.6 + 40;

        return (
          <motion.circle
            key={`${particle.id}-${mode}`}
            cx={cx}
            cy={cy}
            r={particle.radius}
            fill={toneColor(particle.tone)}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: emphasize ? 0.82 : 0.48, scale: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 0.26,
              delay: index * 0.02,
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
    width,
    height,
    seed: 31 + reactantParticles * 7 + productParticles * 11,
  });
  const dispersalIncreases = entropyChange >= 0;
  const reactantMode = dispersalIncreases ? "ordered" : "dispersed";
  const productMode = dispersalIncreases ? "dispersed" : "ordered";
  const tone = entropyChange >= 0 ? "teal" : "blue";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full"
      role="img"
      aria-label="Entropy particle dispersal visualization"
    >
      <Group>
        <text x={104} y={32} textAnchor="middle" fontSize={12} fill="#64727c">
          reactants
        </text>
        <text x={256} y={32} textAnchor="middle" fontSize={12} fill="#64727c">
          products
        </text>

        <ellipse
          cx={104}
          cy={118}
          rx={58}
          ry={62}
          fill="none"
          stroke="#dbe5e9"
          strokeWidth={1.5}
          strokeDasharray="4 6"
        />
        <ellipse
          cx={256}
          cy={118}
          rx={58}
          ry={62}
          fill="none"
          stroke="#dbe5e9"
          strokeWidth={1.5}
          strokeDasharray="4 6"
        />

        <ParticleState
          particles={particles}
          count={reactantParticles}
          xOffset={42}
          mode={reactantMode}
          emphasize={false}
          reduceMotion={reduceMotion}
        />
        <ParticleState
          particles={particles}
          count={productParticles}
          xOffset={194}
          mode={productMode}
          emphasize
          reduceMotion={reduceMotion}
        />

        <motion.path
          d="M168 118 C181 105, 191 105, 204 118"
          fill="none"
          stroke={toneColor(tone)}
          strokeWidth={2.6}
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.42, delay: 0.18, ease: "easeOut" }}
        />
        <path
          d="M198 112 L205 118 L198 124"
          fill="none"
          stroke={toneColor(tone)}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <text x={104} y={198} textAnchor="middle" fontSize={11} fill="#64727c">
          {reactantMode === "ordered" ? "ordered state" : "dispersed state"}
        </text>
        <text x={256} y={198} textAnchor="middle" fontSize={11} fill="#64727c">
          {productMode === "dispersed" ? "dispersed state" : "ordered state"}
        </text>

        <motion.text
          x={180}
          y={224}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={14}
          fill="#172026"
          initial={reduceMotion ? false : { opacity: 0, y: 230 }}
          animate={{ opacity: 1, y: 224 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, delay: 0.36, ease: "easeOut" }}
        >
          {`ΔS = ${formatSignedSceneNumber(entropyChange)} J mol⁻¹ K⁻¹`}
        </motion.text>
      </Group>
    </svg>
  );
}
