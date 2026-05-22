"use client";

import {
  AnimationVariantRunner,
  type AnimationVariantDefinition,
} from "@/components/animation-lab/AnimationVariantRunner";

const variants: AnimationVariantDefinition[] = [
  {
    id: "gibbs",
    title: "Gibbs free energy",
    testId: "animation-variant-gibbs",
    durationMs: 6200,
    concept: "Delta H and T Delta S are measured, temperature scales the entropy term, then the sign of Delta G determines spontaneity.",
    stages: [
      "Introduce Delta G = Delta H - T Delta S.",
      "Set the enthalpy term as a measured value.",
      "Raise temperature to scale T Delta S.",
      "Subtract the entropy term from Delta H.",
      "Use the negative Delta G sign to mark spontaneity.",
    ],
  },
  {
    id: "entropy",
    title: "Entropy",
    testId: "animation-variant-entropy",
    durationMs: 5200,
    concept: "A constraint is removed, the count of accessible arrangements increases, and Delta S follows the increase in W.",
    stages: [
      "Introduce the constrained state count.",
      "Unlock more energy locations.",
      "Reveal additional accessible arrangements.",
      "Compare W_initial and W_final.",
      "Conclude that Delta S is positive.",
    ],
  },
  {
    id: "formation",
    title: "Formation enthalpy",
    testId: "animation-variant-formation",
    durationMs: 5600,
    concept: "Coefficients multiply tabulated formation enthalpies, product and reactant subtotals form, then products minus reactants gives Delta H.",
    stages: [
      "Introduce the balanced combustion equation.",
      "Multiply product coefficients by formation values.",
      "Multiply reactant coefficients, including zero for O2.",
      "Build product and reactant subtotals.",
      "Subtract reactants from products to reveal Delta H.",
    ],
  },
  {
    id: "bonds",
    title: "Bond enthalpy",
    testId: "animation-variant-bonds",
    durationMs: 5400,
    concept: "Breaking bonds absorbs energy, forming bonds releases energy, and the difference becomes Delta H.",
    stages: [
      "Identify the bonds that must be broken.",
      "Add the bond-breaking energy input.",
      "Identify the bonds that form in products.",
      "Subtract the energy released by formed bonds.",
      "Reveal the net exothermic Delta H.",
    ],
  },
];

export function AnimationLab() {
  return (
    <main className="animation-lab-page">
      <header className="animation-lab-header">
        <p>Animation audit harness</p>
        <h1>Thermodynamics motion runs</h1>
        <span>
          Controlled, finite science-animation sequences for recording, tracing,
          reduced-motion inspection, and frame-performance measurement. This
          route is separate from the production lesson logic.
        </span>
      </header>

      <div className="animation-lab-stack">
        {variants.map((variant) => (
          <AnimationVariantRunner key={variant.id} variant={variant} />
        ))}
      </div>
    </main>
  );
}
