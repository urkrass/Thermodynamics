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
  valueDomain,
  type FormationSceneData,
  type SceneTerm,
} from "@/components/science-scenes/sceneMath";

type FormationEnthalpySceneProps = FormationSceneData & {
  reduceMotion: boolean;
};

function sideLabel(terms: SceneTerm[]) {
  return terms.map(displayTermLabel).join(" + ");
}

export function FormationEnthalpyScene({
  reactants,
  products,
  unit = "kJ mol^-1",
  reduceMotion,
}: FormationEnthalpySceneProps) {
  const reactantTotal = totalContribution(reactants);
  const productTotal = totalContribution(products);
  const deltaH = productTotal - reactantTotal;
  const yScale = scaleLinear({
    domain: valueDomain([reactantTotal, productTotal], 140),
    range: [188, 62],
  });
  const reactantY = yScale(reactantTotal);
  const productY = yScale(productTotal);
  const arrowTop = Math.min(reactantY, productY);
  const arrowBottom = Math.max(reactantY, productY);
  const isEndothermic = productY < reactantY;
  const deltaTone = deltaH < 0 ? "teal" : "amber";
  const unitText = formatSvgUnit(unit);

  return (
    <svg
      viewBox="0 0 360 260"
      className="h-full w-full"
      role="img"
      aria-label="Formation enthalpy products minus reactants visualization"
    >
      <Group>
        <text x={88} y={32} textAnchor="middle" fontSize={12} fill="#64727c">
          reactants
        </text>
        <text x={272} y={32} textAnchor="middle" fontSize={12} fill="#64727c">
          products
        </text>

        <line x1={180} x2={180} y1={48} y2={206} stroke="#e3ebef" strokeWidth={1.5} />
        <text x={192} y={54} fontSize={10.5} fill="#8a98a3">
          enthalpy
        </text>

        <motion.line
          x1={44}
          x2={150}
          y1={reactantY}
          y2={reactantY}
          stroke="#517da5"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.42, ease: "easeOut" }}
        />
        <motion.line
          x1={210}
          x2={316}
          y1={productY}
          y2={productY}
          stroke="#2b8f8a"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.42, delay: 0.08, ease: "easeOut" }}
        />

        <text
          x={88}
          y={reactantY < 82 ? reactantY + 18 : reactantY - 10}
          textAnchor="middle"
          fontSize={12}
          fill="#172026"
        >
          {sideLabel(reactants)}
        </text>
        <text
          x={88}
          y={reactantY < 82 ? reactantY + 34 : reactantY + 18}
          textAnchor="middle"
          fontSize={11}
          fill="#64727c"
        >
          {`ΣR = ${formatSignedSceneNumber(reactantTotal)}`}
        </text>
        <text
          x={272}
          y={productY < 82 ? productY + 18 : productY - 10}
          textAnchor="middle"
          fontSize={12}
          fill="#172026"
        >
          {sideLabel(products)}
        </text>
        <text
          x={272}
          y={productY < 82 ? productY + 34 : productY + 18}
          textAnchor="middle"
          fontSize={11}
          fill="#64727c"
        >
          {`ΣP = ${formatSignedSceneNumber(productTotal)}`}
        </text>

        <motion.path
          d={`M180 ${isEndothermic ? arrowBottom - 4 : arrowTop + 4} L180 ${
            isEndothermic ? arrowTop + 8 : arrowBottom - 8
          }`}
          fill="none"
          stroke={toneColor(deltaTone)}
          strokeWidth={2.6}
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.22, ease: "easeOut" }}
        />
        <path
          d={
            isEndothermic
              ? `M174 ${arrowTop + 15} L180 ${arrowTop + 6} L186 ${arrowTop + 15}`
              : `M174 ${arrowBottom - 15} L180 ${arrowBottom - 6} L186 ${arrowBottom - 15}`
          }
          fill="none"
          stroke={toneColor(deltaTone)}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
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
