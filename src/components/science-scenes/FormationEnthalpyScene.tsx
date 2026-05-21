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
    domain: valueDomain([reactantTotal, productTotal], 160),
    range: [140, 50],
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
      viewBox="0 0 720 190"
      className="h-full w-full overflow-visible"
      role="img"
      aria-label="Formation enthalpy products minus reactants visualization"
    >
      <Group>
        <text x={155} y={24} textAnchor="middle" fontSize={15} fill="#64727c">
          reactants
        </text>
        <text x={565} y={24} textAnchor="middle" fontSize={15} fill="#64727c">
          products
        </text>

        <line x1={360} x2={360} y1={36} y2={152} stroke="#dbe5e9" strokeWidth={2} />
        <text x={376} y={50} fontSize={13} fill="#8a98a3">
          enthalpy
        </text>

        <motion.line
          x1={70}
          x2={300}
          y1={reactantY}
          y2={reactantY}
          stroke={toneColor("blue")}
          strokeWidth={3.5}
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
        />
        <motion.line
          x1={420}
          x2={650}
          y1={productY}
          y2={productY}
          stroke={toneColor("teal")}
          strokeWidth={3.5}
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.08, ease: "easeOut" }}
        />

        <text
          x={185}
          y={reactantY < 100 ? reactantY + 28 : reactantY - 16}
          textAnchor="middle"
          fontSize={16}
          fill="#172026"
        >
          {sideLabel(reactants)}
        </text>
        <text
          x={185}
          y={reactantY < 100 ? reactantY + 52 : reactantY + 28}
          textAnchor="middle"
          fontSize={13}
          fill="#64727c"
        >
          {`ΣR = ${formatSignedSceneNumber(reactantTotal)} ${unitText}`}
        </text>
        <text
          x={535}
          y={productY < 100 ? productY + 28 : productY - 16}
          textAnchor="middle"
          fontSize={16}
          fill="#172026"
        >
          {sideLabel(products)}
        </text>
        <text
          x={535}
          y={productY < 100 ? productY + 52 : productY + 28}
          textAnchor="middle"
          fontSize={13}
          fill="#64727c"
        >
          {`ΣP = ${formatSignedSceneNumber(productTotal)} ${unitText}`}
        </text>

        <motion.path
          d={`M360 ${isEndothermic ? arrowBottom - 8 : arrowTop + 8} L360 ${
            isEndothermic ? arrowTop + 12 : arrowBottom - 12
          }`}
          fill="none"
          stroke={toneColor(deltaTone)}
          strokeWidth={3.5}
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, delay: 0.22, ease: "easeOut" }}
        />
        <path
          d={
            isEndothermic
              ? `M351 ${arrowTop + 22} L360 ${arrowTop + 9} L369 ${arrowTop + 22}`
              : `M351 ${arrowBottom - 22} L360 ${arrowBottom - 9} L369 ${arrowBottom - 22}`
          }
          fill="none"
          stroke={toneColor(deltaTone)}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <motion.text
          x={360}
          y={174}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={20}
          fontWeight={650}
          fill="#172026"
          initial={reduceMotion ? false : { opacity: 0, y: 182 }}
          animate={{ opacity: 1, y: 174 }}
          transition={{ duration: reduceMotion ? 0 : 0.3, delay: 0.42, ease: "easeOut" }}
        >
          {`ΔH = ${formatSignedSceneNumber(deltaH)} ${unitText}`}
        </motion.text>
      </Group>
    </svg>
  );
}
