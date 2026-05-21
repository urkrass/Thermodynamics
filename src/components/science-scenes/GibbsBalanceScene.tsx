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
    range: [28, 82],
  });
  const gaugeLimit = Math.max(80, magnitude);
  const gaugeScale = scaleLinear({
    domain: [-gaugeLimit, gaugeLimit],
    range: [92, 268],
  });
  const hLength = termScale(Math.abs(deltaH));
  const tsLength = termScale(Math.abs(tDeltaS));

  return (
    <svg
      viewBox="0 0 360 260"
      className="h-full w-full"
      role="img"
      aria-label="Gibbs free energy balance visualization"
    >
      <Group>
        <text x={180} y={31} textAnchor="middle" fontSize={13} fill="#64727c">
          ΔG = ΔH − TΔS
        </text>

        <motion.g
          initial={reduceMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.26, ease: "easeOut" }}
        >
          <text x={78} y={62} textAnchor="middle" fontSize={11} fill="#b85c6a">
            ΔH
          </text>
          <text x={282} y={62} textAnchor="middle" fontSize={11} fill="#2b8f8a">
            TΔS
          </text>
          <line x1={180 - hLength} x2={180} y1={76} y2={76} stroke="#b85c6a" strokeWidth={3} />
          <line x1={180} x2={180 + tsLength} y1={76} y2={76} stroke="#2b8f8a" strokeWidth={3} />
          <circle cx={180} cy={76} r={3.5} fill="#64727c" />
          <text x={180 - hLength / 2} y={96} textAnchor="middle" fontSize={10.5} fill="#172026">
            {formatSignedSceneNumber(deltaH)}
          </text>
          <text x={180 + tsLength / 2} y={96} textAnchor="middle" fontSize={10.5} fill="#172026">
            {formatSignedSceneNumber(tDeltaS)}
          </text>
        </motion.g>

        <motion.g
          initial={reduceMotion ? false : { rotate: 0 }}
          animate={{ rotate: tilt }}
          transition={{ duration: reduceMotion ? 0 : 0.62, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ transformOrigin: "180px 154px" }}
        >
          <line x1={76} y1={154} x2={284} y2={154} stroke="#64727c" strokeWidth={4} strokeLinecap="round" />
          <circle cx={180} cy={154} r={8} fill="#172026" />
          <line x1={100} x2={100} y1={143} y2={165} stroke="#b85c6a" strokeWidth={2.2} />
          <line x1={260} x2={260} y1={143} y2={165} stroke="#2b8f8a" strokeWidth={2.2} />
        </motion.g>

        <motion.text
          x={180}
          y={119}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={14}
          fill="#172026"
          initial={reduceMotion ? false : { opacity: 0, y: 125 }}
          animate={{ opacity: 1, y: 119 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, delay: 0.34, ease: "easeOut" }}
        >
          {`ΔG = ${formatSignedSceneNumber(deltaG)} kJ mol⁻¹`}
        </motion.text>
        <text x={180} y={135} textAnchor="middle" dominantBaseline="middle" fontSize={11} fill={signalColor}>
          {`${feasibleLabel} at ${temperature} K`}
        </text>

        <line x1={92} x2={268} y1={204} y2={204} stroke="#dbe5e9" strokeWidth={2.6} strokeLinecap="round" />
        <motion.circle
          cy={204}
          r={5.8}
          fill={signalColor}
          initial={reduceMotion ? false : { cx: 180, opacity: 0.35 }}
          animate={{ cx: gaugeScale(deltaG), opacity: 0.95 }}
          transition={{ duration: reduceMotion ? 0 : 0.52, delay: 0.22, ease: "easeOut" }}
        />
        <text x={92} y={224} fontSize={11} fill="#64727c">
          feasible
        </text>
        <text x={218} y={224} fontSize={11} fill="#64727c">
          not feasible
        </text>
      </Group>
    </svg>
  );
}
