"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { motion } from "motion/react";
import {
  formatSignedSceneNumber,
  gibbsSignalColor,
  gibbsTerms,
  gibbsTiltAngle,
  maxMagnitude,
  type GibbsSceneData,
} from "@/components/science-scenes/sceneMath";

type GibbsBalanceSceneProps = GibbsSceneData & {
  reduceMotion: boolean;
};

export function GibbsBalanceScene({
  deltaH,
  deltaS,
  temperature,
  reduceMotion,
}: GibbsBalanceSceneProps) {
  const { tDeltaS, deltaG, feasibleLabel } = gibbsTerms(deltaH, deltaS, temperature);
  const signalColor = gibbsSignalColor(deltaG);
  const tilt = gibbsTiltAngle(deltaG);
  const magnitude = maxMagnitude([deltaH, tDeltaS, deltaG]);
  const termScale = scaleLinear({
    domain: [0, magnitude],
    range: [70, 170],
  });
  const gaugeLimit = Math.max(80, magnitude);
  const gaugeScale = scaleLinear({
    domain: [-gaugeLimit, gaugeLimit],
    range: [180, 540],
  });
  const hLength = termScale(Math.abs(deltaH));
  const tsLength = termScale(Math.abs(tDeltaS));

  return (
    <svg
      viewBox="0 0 720 190"
      className="h-full w-full overflow-visible"
      role="img"
      aria-label="Gibbs free energy balance visualization"
    >
      <Group>
        <text x={360} y={24} textAnchor="middle" fontSize={17} fill="#64727c">
          ΔG = ΔH − TΔS
        </text>

        <motion.g
          initial={reduceMotion ? false : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.26, ease: "easeOut" }}
        >
          <text x={178} y={48} textAnchor="middle" fontSize={15} fill="#b85c6a">
            ΔH
          </text>
          <text x={542} y={48} textAnchor="middle" fontSize={15} fill="#2b8f8a">
            TΔS
          </text>
          <line x1={360 - hLength} x2={360} y1={64} y2={64} stroke="#b85c6a" strokeWidth={5} />
          <line x1={360} x2={360 + tsLength} y1={64} y2={64} stroke="#2b8f8a" strokeWidth={5} />
          <circle cx={360} cy={64} r={5} fill="#64727c" />
          <text x={360 - hLength / 2} y={87} textAnchor="middle" fontSize={14} fill="#172026">
            {formatSignedSceneNumber(deltaH)}
          </text>
          <text x={360 + tsLength / 2} y={87} textAnchor="middle" fontSize={14} fill="#172026">
            {formatSignedSceneNumber(tDeltaS)}
          </text>
        </motion.g>

        <motion.text
          x={360}
          y={108}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={24}
          fontWeight={650}
          fill="#172026"
          initial={reduceMotion ? false : { opacity: 0, y: 118 }}
          animate={{ opacity: 1, y: 108 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, delay: 0.34, ease: "easeOut" }}
        >
          {`ΔG = ${formatSignedSceneNumber(deltaG)} kJ mol⁻¹`}
        </motion.text>
        <text x={360} y={130} textAnchor="middle" dominantBaseline="middle" fontSize={15} fill={signalColor}>
          {`${feasibleLabel} at ${temperature} K`}
        </text>

        <motion.g
          initial={reduceMotion ? false : { rotate: 0 }}
          animate={{ rotate: tilt }}
          transition={{ duration: reduceMotion ? 0 : 0.62, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ transformOrigin: "360px 150px" }}
        >
          <line x1={142} y1={150} x2={578} y2={150} stroke="#64727c" strokeWidth={5} strokeLinecap="round" />
          <circle cx={360} cy={150} r={9} fill="#172026" />
          <line x1={206} x2={206} y1={137} y2={163} stroke="#b85c6a" strokeWidth={3} />
          <line x1={514} x2={514} y1={137} y2={163} stroke="#2b8f8a" strokeWidth={3} />
        </motion.g>

        <line x1={180} x2={540} y1={174} y2={174} stroke="#dbe5e9" strokeWidth={3.5} strokeLinecap="round" />
        <motion.circle
          cy={174}
          r={7}
          fill={signalColor}
          initial={reduceMotion ? false : { cx: 360, opacity: 0.35 }}
          animate={{ cx: gaugeScale(deltaG), opacity: 0.95 }}
          transition={{ duration: reduceMotion ? 0 : 0.52, delay: 0.22, ease: "easeOut" }}
        />
        <text x={180} y={188} fontSize={12} fill="#64727c">
          feasible
        </text>
        <text x={470} y={188} fontSize={12} fill="#64727c">
          not feasible
        </text>
      </Group>
    </svg>
  );
}
