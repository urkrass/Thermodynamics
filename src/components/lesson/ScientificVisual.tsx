"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { BondEnthalpyScene } from "@/components/science-scenes/BondEnthalpyScene";
import { EntropyParticleScene } from "@/components/science-scenes/EntropyParticleScene";
import { FormationEnthalpyScene } from "@/components/science-scenes/FormationEnthalpyScene";
import { GibbsBalanceScene } from "@/components/science-scenes/GibbsBalanceScene";
import { ParticleField } from "@/components/science-scenes/ParticleField";
import type {
  BondSceneData,
  EntropySceneData,
  FormationSceneData,
  GibbsSceneData,
  SceneData,
} from "@/components/science-scenes/sceneMath";
import type { VisualType } from "@/data/thermoLesson";

type ScientificVisualProps = {
  type?: VisualType;
  sceneData?: SceneData;
};

const defaultFormationScene: FormationSceneData = {
  kind: "formation",
  reactants: [
    { label: "CH4(g)", value: -74.8, tone: "blue" },
    { label: "O2(g)", value: 0, coefficient: 2, tone: "slate" },
  ],
  products: [
    { label: "CO2(g)", value: -393.5, tone: "teal" },
    { label: "H2O(l)", value: -285.8, coefficient: 2, tone: "amber" },
  ],
};

const defaultBondScene: BondSceneData = {
  kind: "bonds",
  brokenBonds: [
    { label: "H-H", value: 436, tone: "amber" },
    { label: "Cl-Cl", value: 242, tone: "amber" },
  ],
  formedBonds: [{ label: "H-Cl", value: 431, coefficient: 2, tone: "teal" }],
};

const defaultEntropyScene: EntropySceneData = {
  kind: "entropy",
  entropyChange: 160.6,
  reactantParticles: 4,
  productParticles: 7,
};

const defaultGibbsScene: GibbsSceneData = {
  kind: "gibbs",
  deltaH: -92.4,
  deltaS: -0.1986,
  temperature: 298,
};

function SummaryScene() {
  const nodes: Array<[string, number, number, string]> = [
    ["ΔH°", 130, 62, "#2b8f8a"],
    ["bond ΔH", 320, 62, "#c78320"],
    ["ΔS°", 510, 62, "#517da5"],
    ["ΔG", 320, 132, "#b85c6a"],
  ];

  return (
    <svg
      viewBox="0 0 720 190"
      className="h-full w-full"
      role="img"
      aria-label="Thermodynamics formulas summary"
    >
      <path
        d="M154 62 H296 M344 62 H486 M320 80 V108"
        fill="none"
        stroke="#dbe5e9"
        strokeWidth={3}
        strokeLinecap="round"
      />
      {nodes.map(([label, x, y, color]) => (
        <g key={label}>
          <circle cx={x} cy={y} r={6} fill={color} opacity={0.9} />
          <text
            x={x}
            y={y + 25}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={18}
            fill="#172026"
          >
            {label}
          </text>
        </g>
      ))}
      <text x={320} y={168} textAnchor="middle" fontSize={15} fill="#64727c">
        choose the data, apply coefficients, keep units consistent
      </text>
    </svg>
  );
}

function getFormationScene(sceneData?: SceneData) {
  return sceneData?.kind === "formation" ? sceneData : defaultFormationScene;
}

function getBondScene(sceneData?: SceneData) {
  return sceneData?.kind === "bonds" ? sceneData : defaultBondScene;
}

function getEntropyScene(sceneData?: SceneData) {
  return sceneData?.kind === "entropy" ? sceneData : defaultEntropyScene;
}

function getGibbsScene(sceneData?: SceneData) {
  return sceneData?.kind === "gibbs" ? sceneData : defaultGibbsScene;
}

export function ScientificVisual({
  type = "particles",
  sceneData,
}: ScientificVisualProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [isMotionPreferenceReady, setIsMotionPreferenceReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsMotionPreferenceReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const reduceMotion = !isMotionPreferenceReady || prefersReducedMotion;
  const sceneKey = `${type}-${isMotionPreferenceReady && !prefersReducedMotion ? "motion" : "static"}`;

  return (
    <div className="lesson-diagram quiet-scrollbar w-full overflow-x-auto py-2">
      <div key={sceneKey} className="mx-auto h-48 w-full min-w-[42rem] max-w-[45rem] sm:min-w-0">
        {type === "formation" ? (
          <FormationEnthalpyScene
            {...getFormationScene(sceneData)}
            reduceMotion={reduceMotion}
          />
        ) : null}
        {type === "bonds" ? (
          <BondEnthalpyScene
            {...getBondScene(sceneData)}
            reduceMotion={reduceMotion}
          />
        ) : null}
        {type === "entropy" ? (
          <EntropyParticleScene
            {...getEntropyScene(sceneData)}
            reduceMotion={reduceMotion}
          />
        ) : null}
        {type === "gibbs" ? (
          <GibbsBalanceScene
            {...getGibbsScene(sceneData)}
            reduceMotion={reduceMotion}
          />
        ) : null}
        {type === "summary" ? <SummaryScene /> : null}
        {type === "particles" ? <ParticleField reduceMotion={reduceMotion} /> : null}
      </div>
    </div>
  );
}
