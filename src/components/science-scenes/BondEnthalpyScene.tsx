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
  const startGap = mode === "form" ? 26 : 0;
  const endGap = mode === "form" ? 0 : 26;
  const tone = mode === "form" ? "teal" : "amber";

  return (
    <motion.g
      initial={reduceMotion ? false : { opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
    >
      <motion.line
        x1={x - 26}
        y1={y}
        x2={x + 26}
        y2={y}
        stroke={toneColor(tone)}
        strokeWidth={3.4}
        strokeLinecap="round"
        initial={reduceMotion ? false : { opacity: mode === "form" ? 0.2 : 1 }}
        animate={{ opacity: mode === "form" ? 1 : 0.18 }}
        transition={{ duration: reduceMotion ? 0 : 0.58, delay: 0.12, ease: "easeInOut" }}
      />
      <motion.circle
        cx={x - 39}
        cy={y}
        r={9}
        fill="#ffffff"
        stroke={toneColor(tone)}
        strokeWidth={2}
        initial={reduceMotion ? false : { x: -startGap }}
        animate={{ x: -endGap }}
        transition={{ duration: reduceMotion ? 0 : 0.58, ease: "easeOut" }}
      />
      <motion.circle
        cx={x + 39}
        cy={y}
        r={9}
        fill="#ffffff"
        stroke={toneColor(tone)}
        strokeWidth={2}
        initial={reduceMotion ? false : { x: startGap }}
        animate={{ x: endGap }}
        transition={{ duration: reduceMotion ? 0 : 0.58, ease: "easeOut" }}
      />
    </motion.g>
  );
}

function EnergyTerm({
  centerX,
  y,
  length,
  color,
  label,
  reduceMotion,
  delay,
}: {
  centerX: number;
  y: number;
  length: number;
  color: string;
  label: string;
  reduceMotion: boolean;
  delay: number;
}) {
  return (
    <Group>
      <motion.line
        x1={centerX - length / 2}
        x2={centerX + length / 2}
        y1={y}
        y2={y}
        stroke={color}
        strokeWidth={3.6}
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0.4 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.5, delay, ease: "easeOut" }}
      />
      <motion.text
        x={centerX}
        y={y + 25}
        textAnchor="middle"
        fontSize={14}
        fill="#172026"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.26, delay: delay + 0.18 }}
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
    range: [90, 190],
  });
  const ledgerY = 110;
  const inputLength = energyScale(brokenTotal);
  const releaseLength = energyScale(formedTotal);
  const unitText = formatSvgUnit(unit);

  return (
    <svg
      viewBox="0 0 720 190"
      className="h-full w-full overflow-visible"
      role="img"
      aria-label="Bond enthalpy broken bonds minus formed bonds visualization"
    >
      <Group>
        <text x={210} y={20} textAnchor="middle" fontSize={15} fill="#64727c">
          bonds broken
        </text>
        <text x={510} y={20} textAnchor="middle" fontSize={15} fill="#64727c">
          bonds formed
        </text>
        <BondAction x={210} y={48} mode="break" reduceMotion={reduceMotion} />
        <BondAction x={510} y={48} mode="form" reduceMotion={reduceMotion} />

        <text x={210} y={78} textAnchor="middle" fontSize={15} fill="#172026">
          {compactBondLabel(brokenBonds)}
        </text>
        <text x={510} y={78} textAnchor="middle" fontSize={15} fill="#172026">
          {compactBondLabel(formedBonds)}
        </text>

        <line x1={80} x2={640} y1={ledgerY} y2={ledgerY} stroke="#dbe5e9" strokeWidth={3} />
        <text x={360} y={ledgerY - 10} textAnchor="middle" fontSize={13} fill="#8a98a3">
          energy ledger
        </text>

        <EnergyTerm
          centerX={210}
          y={ledgerY}
          length={inputLength}
          color={toneColor("amber")}
          label={`input ${formatSignedSceneNumber(brokenTotal)} ${unitText}`}
          reduceMotion={reduceMotion}
          delay={0.14}
        />
        <EnergyTerm
          centerX={510}
          y={ledgerY}
          length={releaseLength}
          color={toneColor("teal")}
          label={`release -${formatSignedSceneNumber(formedTotal).replace("+", "").replace("-", "")} ${unitText}`}
          reduceMotion={reduceMotion}
          delay={0.22}
        />

        <text
          x={360}
          y={174}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={20}
          fontWeight={650}
          fill="#172026"
        >
          {`ΔH = ${formatSignedSceneNumber(deltaH)} ${unitText}`}
        </text>
      </Group>
    </svg>
  );
}
