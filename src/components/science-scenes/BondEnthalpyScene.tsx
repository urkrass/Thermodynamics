"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { motion } from "motion/react";
import {
  displayTermLabel,
  formatSignedSceneNumber,
  formatSvgUnit,
  toneColor,
  totalContribution,
  type BondSceneData,
  type SceneTerm,
} from "@/components/science-scenes/sceneMath";

type BondEnthalpySceneProps = BondSceneData & {
  reduceMotion: boolean;
};

function compactBondLabel(terms: SceneTerm[]) {
  return terms.map(displayTermLabel).join(" + ");
}

function BondAction({
  x,
  y,
  mode,
  reduceMotion,
}: {
  x: number;
  y: number;
  mode: "break" | "form";
  reduceMotion: boolean;
}) {
  const startGap = mode === "form" ? 16 : 0;
  const endGap = mode === "form" ? 0 : 16;
  const tone = mode === "form" ? "teal" : "amber";

  return (
    <motion.g
      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.26, ease: "easeOut" }}
    >
      <motion.line
        x1={x - 15}
        y1={y}
        x2={x + 15}
        y2={y}
        stroke={toneColor(tone)}
        strokeWidth={2.6}
        strokeLinecap="round"
        initial={reduceMotion ? false : { opacity: mode === "form" ? 0.22 : 1 }}
        animate={{ opacity: mode === "form" ? 1 : 0.2 }}
        transition={{ duration: reduceMotion ? 0 : 0.58, delay: 0.12, ease: "easeInOut" }}
      />
      <motion.circle
        cx={x - 22}
        cy={y}
        r={6.6}
        fill="#fbfdfd"
        stroke={toneColor(tone)}
        strokeWidth={1.5}
        initial={reduceMotion ? false : { x: -startGap }}
        animate={{ x: -endGap }}
        transition={{ duration: reduceMotion ? 0 : 0.58, ease: "easeOut" }}
      />
      <motion.circle
        cx={x + 22}
        cy={y}
        r={6.6}
        fill="#fbfdfd"
        stroke={toneColor(tone)}
        strokeWidth={1.5}
        initial={reduceMotion ? false : { x: startGap }}
        animate={{ x: endGap }}
        transition={{ duration: reduceMotion ? 0 : 0.58, ease: "easeOut" }}
      />
    </motion.g>
  );
}

function ArrowMeasure({
  x,
  y0,
  y1,
  color,
  label,
  reduceMotion,
  delay,
}: {
  x: number;
  y0: number;
  y1: number;
  color: string;
  label: string;
  reduceMotion: boolean;
  delay: number;
}) {
  const arrowUp = y1 < y0;
  const arrowY = y1;

  return (
    <Group>
      <motion.line
        x1={x}
        x2={x}
        y1={y0}
        y2={y1}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0.4 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.48, delay, ease: "easeOut" }}
      />
      <path
        d={
          arrowUp
            ? `M${x - 6} ${arrowY + 9} L${x} ${arrowY} L${x + 6} ${arrowY + 9}`
            : `M${x - 6} ${arrowY - 9} L${x} ${arrowY} L${x + 6} ${arrowY - 9}`
        }
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.text
        x={x < 180 ? x - 14 : x + 14}
        y={(y0 + y1) / 2 + 4}
        textAnchor={x < 180 ? "end" : "start"}
        fontSize={11}
        fill="#172026"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.28, delay: delay + 0.22 }}
      >
        {label}
      </motion.text>
    </Group>
  );
}

export function BondEnthalpyScene({
  brokenBonds,
  formedBonds,
  unit = "kJ mol^-1",
  reduceMotion,
}: BondEnthalpySceneProps) {
  const brokenTotal = totalContribution(brokenBonds);
  const formedTotal = totalContribution(formedBonds);
  const deltaH = brokenTotal - formedTotal;
  const energyScale = scaleLinear({
    domain: [0, Math.max(brokenTotal, formedTotal, 1)],
    range: [0, 78],
  });
  const baseline = 142;
  const inputHeight = energyScale(brokenTotal);
  const releaseHeight = energyScale(formedTotal);
  const unitText = formatSvgUnit(unit);

  return (
    <svg
      viewBox="0 0 360 260"
      className="h-full w-full"
      role="img"
      aria-label="Bond enthalpy broken bonds minus formed bonds visualization"
    >
      <Group>
        <text x={104} y={32} textAnchor="middle" fontSize={12} fill="#64727c">
          bonds broken
        </text>
        <text x={256} y={32} textAnchor="middle" fontSize={12} fill="#64727c">
          bonds formed
        </text>
        <BondAction x={104} y={56} mode="break" reduceMotion={reduceMotion} />
        <BondAction x={256} y={56} mode="form" reduceMotion={reduceMotion} />

        <text x={104} y={93} textAnchor="middle" fontSize={11} fill="#64727c">
          {compactBondLabel(brokenBonds)}
        </text>
        <text x={256} y={93} textAnchor="middle" fontSize={11} fill="#64727c">
          {compactBondLabel(formedBonds)}
        </text>

        <line x1={56} x2={304} y1={baseline} y2={baseline} stroke="#dbe5e9" strokeWidth={2} />
        <text x={180} y={baseline - 8} textAnchor="middle" fontSize={10.5} fill="#8a98a3">
          energy ledger
        </text>

        <ArrowMeasure
          x={104}
          y0={baseline}
          y1={baseline - inputHeight}
          color={toneColor("amber")}
          label={`input ${formatSignedSceneNumber(brokenTotal)}`}
          reduceMotion={reduceMotion}
          delay={0.14}
        />
        <ArrowMeasure
          x={256}
          y0={baseline}
          y1={baseline + releaseHeight}
          color={toneColor("teal")}
          label={`release -${formatSignedSceneNumber(formedTotal).replace("+", "").replace("-", "")}`}
          reduceMotion={reduceMotion}
          delay={0.22}
        />

        <text
          x={180}
          y={232}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={15}
          fontWeight={600}
          fill="#172026"
        >
          {`ΔH = ${formatSignedSceneNumber(deltaH)} ${unitText}`}
        </text>
      </Group>
    </svg>
  );
}
