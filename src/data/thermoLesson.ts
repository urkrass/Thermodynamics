import type { SceneData } from "@/components/science-scenes/sceneMath";

export type LessonSectionId =
  | "start"
  | "formation"
  | "bond"
  | "entropy"
  | "gibbs"
  | "mixed"
  | "summary";

export type StepType =
  | "intro"
  | "theory"
  | "example"
  | "exercise"
  | "checkpoint"
  | "summary";

export type VisualType =
  | "particles"
  | "formation"
  | "bonds"
  | "entropy"
  | "gibbs"
  | "summary";

export type LessonSection = {
  id: LessonSectionId;
  title: string;
  shortTitle: string;
  accent: "teal" | "amber" | "blue" | "rose" | "slate";
};

export type Equation = {
  latex: string;
  caption?: string;
};

export type CommonMistake = {
  label: string;
  expected: number;
  tolerance?: number;
  feedback: string;
};

export type UnitRequirement = {
  label: string;
  tokens: string[];
  missingFeedback: string;
};

export type NumericAnswerPart = {
  id: string;
  label: string;
  expected: number;
  tolerance: number;
  closeTolerance?: number;
  unit?: UnitRequirement;
  correctFeedback: string;
  closeFeedback: string;
  incorrectFeedback: string;
  commonMistakes?: CommonMistake[];
};

export type ExerciseCheck =
  | {
      mode: "numeric";
      answerParts: NumericAnswerPart[];
    }
  | {
      mode: "choice";
      expectedChoiceId: string;
      choices: Array<{ id: string; label: string }>;
      correctFeedback: string;
      incorrectFeedback: string;
    }
  | {
      mode: "text";
      keywords: string[];
      minMatches: number;
      correctFeedback: string;
      closeFeedback: string;
      incorrectFeedback: string;
      sampleAnswer: string;
    };

export type ExampleContent = {
  problem: string;
  data: string[];
  working: string[];
  conclusion?: string;
};

export type ExerciseContent = {
  prompt: string;
  data?: string[];
  hint: string;
  solution: string[];
  check: ExerciseCheck;
};

export type SummaryRow = {
  method: string;
  formula: string;
  dataNeeded: string;
  commonMistake: string;
};

export type LessonStep = {
  id: string;
  section: LessonSectionId;
  title: string;
  type: StepType;
  body: string[];
  equations?: Equation[];
  visualType?: VisualType;
  sceneData?: SceneData;
  example?: ExampleContent;
  exercise?: ExerciseContent;
  summaryRows?: SummaryRow[];
};

const unitKj: UnitRequirement = {
  label: "kJ mol^-1",
  tokens: ["kj"],
  missingFeedback: "The number is right. Add kJ mol^-1 so the unit is clear.",
};

const unitEntropy: UnitRequirement = {
  label: "J mol^-1 K^-1",
  tokens: ["j"],
  missingFeedback: "The value is right. Include J mol^-1 K^-1 for entropy.",
};

const unitKelvin: UnitRequirement = {
  label: "K",
  tokens: ["k"],
  missingFeedback: "The temperature is right. Include K because Gibbs calculations use Kelvin.",
};

const formationScenes = {
  methaneCombustion: {
    kind: "formation",
    reactants: [
      { label: "CH4(g)", value: -74.8, tone: "blue" },
      { label: "O2(g)", value: 0, coefficient: 2, tone: "slate" },
    ],
    products: [
      { label: "CO2(g)", value: -393.5, tone: "teal" },
      { label: "H2O(l)", value: -285.8, coefficient: 2, tone: "amber" },
    ],
  },
  etheneCombustion: {
    kind: "formation",
    reactants: [
      { label: "C2H4(g)", value: 52.3, tone: "blue" },
      { label: "O2(g)", value: 0, coefficient: 3, tone: "slate" },
    ],
    products: [
      { label: "CO2(g)", value: -393.5, coefficient: 2, tone: "teal" },
      { label: "H2O(l)", value: -285.8, coefficient: 2, tone: "amber" },
    ],
  },
  calciumCarbonate: {
    kind: "formation",
    reactants: [{ label: "CaCO3(s)", value: -1206.9, tone: "blue" }],
    products: [
      { label: "CaO(s)", value: -635.1, tone: "teal" },
      { label: "CO2(g)", value: -393.5, tone: "amber" },
    ],
  },
  waterFormation: {
    kind: "formation",
    reactants: [
      { label: "H2(g)", value: 0, tone: "slate" },
      { label: "O2(g)", value: 0, coefficient: 0.5, tone: "slate" },
    ],
    products: [{ label: "H2O(l)", value: -285.8, tone: "teal" }],
  },
} as const satisfies Record<string, SceneData>;

const bondScenes = {
  hydrogenChloride: {
    kind: "bonds",
    brokenBonds: [
      { label: "H-H", value: 436, tone: "amber" },
      { label: "Cl-Cl", value: 242, tone: "amber" },
    ],
    formedBonds: [{ label: "H-Cl", value: 431, coefficient: 2, tone: "teal" }],
  },
  methaneCombustion: {
    kind: "bonds",
    brokenBonds: [
      { label: "C-H", value: 413, coefficient: 4, tone: "amber" },
      { label: "O=O", value: 498, coefficient: 2, tone: "amber" },
    ],
    formedBonds: [
      { label: "C=O", value: 805, coefficient: 2, tone: "teal" },
      { label: "O-H", value: 463, coefficient: 4, tone: "teal" },
    ],
  },
  ammonia: {
    kind: "bonds",
    brokenBonds: [
      { label: "N≡N", value: 945, tone: "amber" },
      { label: "H-H", value: 436, coefficient: 3, tone: "amber" },
    ],
    formedBonds: [{ label: "N-H", value: 391, coefficient: 6, tone: "teal" }],
  },
} as const satisfies Record<string, SceneData>;

const entropyScenes = {
  ammonia: {
    kind: "entropy",
    entropyChange: -198.6,
    reactantParticles: 8,
    productParticles: 4,
  },
  calciumCarbonate: {
    kind: "entropy",
    entropyChange: 160.6,
    reactantParticles: 3,
    productParticles: 8,
  },
  methaneCombustion: {
    kind: "entropy",
    entropyChange: -242.8,
    reactantParticles: 9,
    productParticles: 5,
  },
} as const satisfies Record<string, SceneData>;

const gibbsScenes = {
  ammonia298: {
    kind: "gibbs",
    deltaH: -92.4,
    deltaS: -0.1986,
    temperature: 298,
  },
  roomTemperature: {
    kind: "gibbs",
    deltaH: -120.0,
    deltaS: -0.25,
    temperature: 298,
  },
  calciumCarbonateHighTemperature: {
    kind: "gibbs",
    deltaH: 178.3,
    deltaS: 0.1606,
    temperature: 1500,
  },
  threshold: {
    kind: "gibbs",
    deltaH: 95.0,
    deltaS: 0.22,
    temperature: 431.8,
  },
  mixedUnitConversion: {
    kind: "gibbs",
    deltaH: -40.0,
    deltaS: -0.12,
    temperature: 310,
  },
  highTemperatureConcept: {
    kind: "gibbs",
    deltaH: 95.0,
    deltaS: 0.22,
    temperature: 520,
  },
} as const satisfies Record<string, SceneData>;

export const lessonSections: LessonSection[] = [
  { id: "start", title: "Start", shortTitle: "Start", accent: "teal" },
  {
    id: "formation",
    title: "Formation enthalpy",
    shortTitle: "Formation",
    accent: "teal",
  },
  {
    id: "bond",
    title: "Bond enthalpy",
    shortTitle: "Bonds",
    accent: "amber",
  },
  { id: "entropy", title: "Entropy", shortTitle: "Entropy", accent: "blue" },
  {
    id: "gibbs",
    title: "Gibbs free energy",
    shortTitle: "Gibbs",
    accent: "rose",
  },
  {
    id: "mixed",
    title: "Mixed practice",
    shortTitle: "Practice",
    accent: "slate",
  },
  { id: "summary", title: "Summary", shortTitle: "Summary", accent: "teal" },
];

export const thermoLesson: LessonStep[] = [
  {
    id: "start-welcome",
    section: "start",
    title: "Thermodynamics Calculations",
    type: "intro",
    visualType: "particles",
    body: [
      "Work through a calm sequence of theory, solved examples, and exercises for formation enthalpy, average bond enthalpy, entropy, and Gibbs free energy.",
      "Each step keeps one idea in focus. Your progress and answers are saved in this browser, so you can leave and continue later.",
      "Begin when you are ready.",
    ],
  },
  {
    id: "formation-theory",
    section: "formation",
    title: "Products minus reactants",
    type: "theory",
    visualType: "formation",
    body: [
      "Use standard enthalpies of formation when the table gives values for whole substances.",
      "Multiply each formation enthalpy by its balanced equation coefficient.",
      "Elements in their standard states, such as O2(g), have a standard enthalpy of formation of zero.",
    ],
    equations: [
      {
        latex:
          "\\Delta H^\\circ_{\\mathrm{rxn}} = \\sum \\Delta H^\\circ_f(\\mathrm{products}) - \\sum \\Delta H^\\circ_f(\\mathrm{reactants})",
      },
    ],
  },
  {
    id: "formation-example-methane",
    section: "formation",
    title: "Solved example: methane combustion",
    type: "example",
    visualType: "formation",
    sceneData: formationScenes.methaneCombustion,
    body: ["First identify product terms and reactant terms, then subtract."],
    equations: [
      {
        latex:
          "\\mathrm{CH_4(g) + 2O_2(g) \\rightarrow CO_2(g) + 2H_2O(l)}",
      },
    ],
    example: {
      problem:
        "Calculate the standard enthalpy change for combustion of methane.",
      data: [
        "CH4(g): -74.8 kJ mol^-1",
        "O2(g): 0 kJ mol^-1",
        "CO2(g): -393.5 kJ mol^-1",
        "H2O(l): -285.8 kJ mol^-1",
      ],
      working: [
        "\\Delta H^\\circ_{\\mathrm{rxn}} = [-393.5 + 2(-285.8)] - [-74.8 + 2(0)]",
        "\\Delta H^\\circ_{\\mathrm{rxn}} = -965.1 - (-74.8)",
        "\\Delta H^\\circ_{\\mathrm{rxn}} = -890.3\\ \\mathrm{kJ\\ mol^{-1}}",
      ],
      conclusion: "The combustion is strongly exothermic.",
    },
  },
  {
    id: "formation-exercise-ethene",
    section: "formation",
    title: "Exercise: ethene combustion",
    type: "exercise",
    visualType: "formation",
    sceneData: formationScenes.etheneCombustion,
    body: ["Use formation enthalpies and remember the coefficients."],
    equations: [
      {
        latex:
          "\\mathrm{C_2H_4(g) + 3O_2(g) \\rightarrow 2CO_2(g) + 2H_2O(l)}",
      },
    ],
    exercise: {
      prompt: "Calculate ΔH°rxn.",
      data: [
        "C2H4(g): +52.3 kJ mol^-1",
        "O2(g): 0 kJ mol^-1",
        "CO2(g): -393.5 kJ mol^-1",
        "H2O(l): -285.8 kJ mol^-1",
      ],
      hint: "Products are 2CO2 and 2H2O. O2 contributes zero, but C2H4 does not.",
      solution: [
        "\\Delta H^\\circ = [2(-393.5) + 2(-285.8)] - [52.3 + 3(0)]",
        "\\Delta H^\\circ = -1358.6 - 52.3",
        "\\Delta H^\\circ = -1411.9\\ \\mathrm{kJ\\ mol^{-1}}",
      ],
      check: {
        mode: "numeric",
        answerParts: [
          {
            id: "delta-h",
            label: "ΔH°rxn",
            expected: -1411.9,
            tolerance: 0.6,
            closeTolerance: 3,
            unit: unitKj,
            correctFeedback: "Correct. Coefficients and sign are both handled.",
            closeFeedback: "Very close. Check rounding and the final unit.",
            incorrectFeedback:
              "Not yet. Recheck products minus reactants and the coefficients on CO2 and H2O.",
            commonMistakes: [
              {
                label: "reversed",
                expected: 1411.9,
                feedback:
                  "This has the products/reactants subtraction reversed. Use products minus reactants.",
              },
              {
                label: "forgot coefficients",
                expected: -731.6,
                tolerance: 1,
                feedback:
                  "This looks like the product coefficients were not fully applied.",
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "formation-exercise-calcium-carbonate",
    section: "formation",
    title: "Exercise: thermal decomposition",
    type: "exercise",
    visualType: "formation",
    sceneData: formationScenes.calciumCarbonate,
    body: ["A positive answer means the reaction absorbs energy."],
    equations: [
      {
        latex: "\\mathrm{CaCO_3(s) \\rightarrow CaO(s) + CO_2(g)}",
      },
    ],
    exercise: {
      prompt: "Calculate ΔH°rxn.",
      data: [
        "CaCO3(s): -1206.9 kJ mol^-1",
        "CaO(s): -635.1 kJ mol^-1",
        "CO2(g): -393.5 kJ mol^-1",
      ],
      hint: "There is one mole of each substance. Keep the reactant bracket negative until the final subtraction.",
      solution: [
        "\\Delta H^\\circ = [(-635.1) + (-393.5)] - [(-1206.9)]",
        "\\Delta H^\\circ = -1028.6 + 1206.9",
        "\\Delta H^\\circ = +178.3\\ \\mathrm{kJ\\ mol^{-1}}",
      ],
      check: {
        mode: "numeric",
        answerParts: [
          {
            id: "delta-h",
            label: "ΔH°rxn",
            expected: 178.3,
            tolerance: 0.4,
            closeTolerance: 2,
            unit: unitKj,
            correctFeedback: "Correct. The decomposition is endothermic.",
            closeFeedback: "Close. Check rounding and keep the positive sign.",
            incorrectFeedback:
              "Not yet. Calculate product sum first, then subtract the reactant value.",
            commonMistakes: [
              {
                label: "reversed",
                expected: -178.3,
                feedback:
                  "The magnitude is right, but the sign is reversed. Use products minus reactants.",
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "bond-theory",
    section: "bond",
    title: "Broken bonds minus formed bonds",
    type: "theory",
    visualType: "bonds",
    body: [
      "Breaking bonds requires energy, so bonds broken are added.",
      "Making bonds releases energy, so bonds formed are subtracted.",
      "Average bond enthalpies are approximate because they average many molecular environments.",
    ],
    equations: [
      {
        latex:
          "\\Delta H = \\sum \\mathrm{bonds\\ broken} - \\sum \\mathrm{bonds\\ formed}",
      },
    ],
  },
  {
    id: "bond-example-hcl",
    section: "bond",
    title: "Solved example: hydrogen chloride",
    type: "example",
    visualType: "bonds",
    sceneData: bondScenes.hydrogenChloride,
    body: ["Count bonds in reactants as broken and bonds in products as formed."],
    equations: [
      {
        latex: "\\mathrm{H_2(g) + Cl_2(g) \\rightarrow 2HCl(g)}",
      },
    ],
    example: {
      problem: "Estimate ΔH using average bond enthalpies.",
      data: ["H-H: 436 kJ mol^-1", "Cl-Cl: 242 kJ mol^-1", "H-Cl: 431 kJ mol^-1"],
      working: [
        "\\mathrm{Broken} = 436 + 242 = 678\\ \\mathrm{kJ\\ mol^{-1}}",
        "\\mathrm{Formed} = 2(431) = 862\\ \\mathrm{kJ\\ mol^{-1}}",
        "\\Delta H = 678 - 862 = -184\\ \\mathrm{kJ\\ mol^{-1}}",
      ],
      conclusion: "More energy is released forming H-Cl bonds than is required to break H-H and Cl-Cl.",
    },
  },
  {
    id: "bond-exercise-methane",
    section: "bond",
    title: "Exercise: methane by bonds",
    type: "exercise",
    visualType: "bonds",
    sceneData: bondScenes.methaneCombustion,
    body: ["Use the gas-phase water value here because the bond method uses gaseous molecules."],
    equations: [
      {
        latex:
          "\\mathrm{CH_4(g) + 2O_2(g) \\rightarrow CO_2(g) + 2H_2O(g)}",
      },
    ],
    exercise: {
      prompt: "Estimate ΔH using average bond enthalpies.",
      data: [
        "C-H: 413 kJ mol^-1",
        "O=O: 498 kJ mol^-1",
        "C=O: 805 kJ mol^-1",
        "O-H: 463 kJ mol^-1",
        "Structural notes: CH4 has four C-H bonds. O2 has one O=O bond per molecule. CO2 has two C=O bonds. H2O has two O-H bonds per molecule.",
      ],
      hint: "Broken: 4 C-H and 2 O=O. Formed: 2 C=O and 4 O-H.",
      solution: [
        "\\mathrm{Broken} = 4(413) + 2(498) = 2648",
        "\\mathrm{Formed} = 2(805) + 4(463) = 3462",
        "\\Delta H = 2648 - 3462 = -814\\ \\mathrm{kJ\\ mol^{-1}}",
        "\\mathrm{Average\\ bond\\ tables\\ vary;\\ this\\ worksheet\\ accepts\\ the\\ course\\ target\\ of\\ about}\\ -802\\ \\mathrm{kJ\\ mol^{-1}}.",
      ],
      check: {
        mode: "numeric",
        answerParts: [
          {
            id: "delta-h",
            label: "ΔH",
            expected: -802,
            tolerance: 12,
            closeTolerance: 25,
            unit: unitKj,
            correctFeedback:
              "Correct. Bond enthalpy values are approximate, so a small range is expected.",
            closeFeedback:
              "Close. Check the count of O-H bonds and remember the method is approximate.",
            incorrectFeedback:
              "Not yet. Count every bond broken and every bond formed before subtracting.",
            commonMistakes: [
              {
                label: "reversed",
                expected: 802,
                tolerance: 12,
                feedback:
                  "This has the subtraction reversed. Bond enthalpy uses broken minus formed.",
              },
              {
                label: "forgot O2 coefficient",
                expected: -1300,
                tolerance: 18,
                feedback:
                  "This looks like the coefficient on O2 may have been missed.",
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "bond-exercise-ammonia",
    section: "bond",
    title: "Exercise: ammonia synthesis",
    type: "exercise",
    visualType: "bonds",
    sceneData: bondScenes.ammonia,
    body: ["The product side has two NH3 molecules, each with three N-H bonds."],
    equations: [
      {
        latex: "\\mathrm{N_2(g) + 3H_2(g) \\rightarrow 2NH_3(g)}",
      },
    ],
    exercise: {
      prompt: "Estimate ΔH using average bond enthalpies.",
      data: ["N≡N: 945 kJ mol^-1", "H-H: 436 kJ mol^-1", "N-H: 391 kJ mol^-1"],
      hint: "Broken: 1 N≡N and 3 H-H. Formed: 6 N-H.",
      solution: [
        "\\mathrm{Broken} = 945 + 3(436) = 2253",
        "\\mathrm{Formed} = 6(391) = 2346",
        "\\Delta H = 2253 - 2346 = -93\\ \\mathrm{kJ\\ mol^{-1}}",
      ],
      check: {
        mode: "numeric",
        answerParts: [
          {
            id: "delta-h",
            label: "ΔH",
            expected: -93,
            tolerance: 2,
            closeTolerance: 6,
            unit: unitKj,
            correctFeedback: "Correct. Six N-H bonds are formed in total.",
            closeFeedback: "Close. Check arithmetic and units.",
            incorrectFeedback:
              "Not yet. Remember that 2NH3 contains six N-H bonds.",
            commonMistakes: [
              {
                label: "reversed",
                expected: 93,
                feedback:
                  "This has the sign reversed. Use bonds broken minus bonds formed.",
              },
              {
                label: "forgot product coefficient",
                expected: 1080,
                tolerance: 3,
                feedback:
                  "This looks like only three N-H bonds were counted instead of six.",
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "entropy-theory",
    section: "entropy",
    title: "Entropy is dispersal",
    type: "theory",
    visualType: "entropy",
    body: [
      "Entropy measures the dispersal of energy and matter.",
      "Use standard molar entropies and calculate products minus reactants.",
      "Entropy often increases when gases are produced or when the number of gas molecules increases.",
    ],
    equations: [
      {
        latex:
          "\\Delta S^\\circ_{\\mathrm{rxn}} = \\sum S^\\circ(\\mathrm{products}) - \\sum S^\\circ(\\mathrm{reactants})",
      },
    ],
  },
  {
    id: "entropy-example-ammonia",
    section: "entropy",
    title: "Solved example: ammonia entropy",
    type: "example",
    visualType: "entropy",
    sceneData: entropyScenes.ammonia,
    body: ["Products minus reactants works here too, but the units are J mol^-1 K^-1."],
    equations: [
      {
        latex: "\\mathrm{N_2(g) + 3H_2(g) \\rightarrow 2NH_3(g)}",
      },
    ],
    example: {
      problem: "Calculate ΔS°rxn.",
      data: [
        "N2(g): 191.5 J mol^-1 K^-1",
        "H2(g): 130.7 J mol^-1 K^-1",
        "NH3(g): 192.5 J mol^-1 K^-1",
      ],
      working: [
        "\\Delta S^\\circ = [2(192.5)] - [191.5 + 3(130.7)]",
        "\\Delta S^\\circ = 385.0 - 583.6",
        "\\Delta S^\\circ = -198.6\\ \\mathrm{J\\ mol^{-1}\\ K^{-1}}",
      ],
      conclusion: "Entropy decreases because four gas molecules become two gas molecules.",
    },
  },
  {
    id: "entropy-exercise-calcium-carbonate",
    section: "entropy",
    title: "Exercise: gas production",
    type: "exercise",
    visualType: "entropy",
    sceneData: entropyScenes.calciumCarbonate,
    body: ["When a gas forms from solids, entropy often increases."],
    equations: [
      {
        latex: "\\mathrm{CaCO_3(s) \\rightarrow CaO(s) + CO_2(g)}",
      },
    ],
    exercise: {
      prompt: "Calculate ΔS°rxn.",
      data: [
        "CaCO3(s): 92.9 J mol^-1 K^-1",
        "CaO(s): 39.8 J mol^-1 K^-1",
        "CO2(g): 213.7 J mol^-1 K^-1",
      ],
      hint: "Add the two product entropies, then subtract the reactant entropy.",
      solution: [
        "\\Delta S^\\circ = [39.8 + 213.7] - [92.9]",
        "\\Delta S^\\circ = 253.5 - 92.9",
        "\\Delta S^\\circ = +160.6\\ \\mathrm{J\\ mol^{-1}\\ K^{-1}}",
      ],
      check: {
        mode: "numeric",
        answerParts: [
          {
            id: "delta-s",
            label: "ΔS°rxn",
            expected: 160.6,
            tolerance: 0.4,
            closeTolerance: 2,
            unit: unitEntropy,
            correctFeedback: "Correct. Gas production increases entropy here.",
            closeFeedback: "Close. Check rounding and include entropy units.",
            incorrectFeedback:
              "Not yet. Add product entropies first, then subtract CaCO3.",
            commonMistakes: [
              {
                label: "reversed",
                expected: -160.6,
                feedback:
                  "The sign is reversed. Entropy changes use products minus reactants.",
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "entropy-exercise-methane",
    section: "entropy",
    title: "Exercise: combustion entropy",
    type: "exercise",
    visualType: "entropy",
    sceneData: entropyScenes.methaneCombustion,
    body: ["Liquid water has much lower molar entropy than gaseous water."],
    equations: [
      {
        latex:
          "\\mathrm{CH_4(g) + 2O_2(g) \\rightarrow CO_2(g) + 2H_2O(l)}",
      },
    ],
    exercise: {
      prompt: "Calculate ΔS°rxn.",
      data: [
        "CH4(g): 186.3 J mol^-1 K^-1",
        "O2(g): 205.0 J mol^-1 K^-1",
        "CO2(g): 213.7 J mol^-1 K^-1",
        "H2O(l): 69.9 J mol^-1 K^-1",
      ],
      hint: "Products: 1CO2 and 2H2O(l). Reactants: 1CH4 and 2O2.",
      solution: [
        "\\Delta S^\\circ = [213.7 + 2(69.9)] - [186.3 + 2(205.0)]",
        "\\Delta S^\\circ = 353.5 - 596.3",
        "\\Delta S^\\circ = -242.8\\ \\mathrm{J\\ mol^{-1}\\ K^{-1}}",
      ],
      check: {
        mode: "numeric",
        answerParts: [
          {
            id: "delta-s",
            label: "ΔS°rxn",
            expected: -242.8,
            tolerance: 0.5,
            closeTolerance: 2,
            unit: unitEntropy,
            correctFeedback: "Correct. Entropy decreases for this set of states.",
            closeFeedback: "Close. Check rounding and units.",
            incorrectFeedback:
              "Not yet. Recheck the coefficient on O2 and the use of liquid water.",
            commonMistakes: [
              {
                label: "reversed",
                expected: 242.8,
                feedback:
                  "This is reversed. Use product entropy sum minus reactant entropy sum.",
              },
              {
                label: "forgot coefficients",
                expected: -107.7,
                tolerance: 1,
                feedback:
                  "This looks like one or more coefficients were missed.",
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "gibbs-theory",
    section: "gibbs",
    title: "Feasibility from ΔG",
    type: "theory",
    visualType: "gibbs",
    sceneData: gibbsScenes.ammonia298,
    body: [
      "Gibbs free energy predicts thermodynamic feasibility under specified conditions.",
      "If ΔG < 0, the reaction is thermodynamically feasible. If ΔG > 0, it is not feasible under those conditions. If ΔG = 0, the system is at equilibrium.",
      "Important unit warning: if ΔH is in kJ mol^-1 and ΔS is in J mol^-1 K^-1, convert ΔS into kJ mol^-1 K^-1 before using the equation.",
    ],
    equations: [
      {
        latex: "\\Delta G = \\Delta H - T\\Delta S",
      },
    ],
  },
  {
    id: "gibbs-example-ammonia",
    section: "gibbs",
    title: "Solved example: feasibility at 298 K",
    type: "example",
    visualType: "gibbs",
    sceneData: gibbsScenes.ammonia298,
    body: ["The sign of ΔG is the decision point."],
    example: {
      problem: "Given ΔH = -92.4 kJ mol^-1, ΔS = -198.6 J mol^-1 K^-1, and T = 298 K, calculate ΔG.",
      data: [
        "ΔH = -92.4 kJ mol^-1",
        "ΔS = -198.6 J mol^-1 K^-1",
        "T = 298 K",
      ],
      working: [
        "\\Delta S = -0.1986\\ \\mathrm{kJ\\ mol^{-1}\\ K^{-1}}",
        "\\Delta G = -92.4 - 298(-0.1986)",
        "\\Delta G = -92.4 + 59.2",
        "\\Delta G = -33.2\\ \\mathrm{kJ\\ mol^{-1}}",
      ],
      conclusion: "ΔG is negative, so the reaction is feasible at 298 K.",
    },
  },
  {
    id: "gibbs-exercise-298",
    section: "gibbs",
    title: "Exercise: Gibbs at room temperature",
    type: "exercise",
    visualType: "gibbs",
    sceneData: gibbsScenes.roomTemperature,
    body: ["Convert entropy first. Then calculate ΔG and decide feasibility."],
    exercise: {
      prompt: "ΔH = -120.0 kJ mol^-1, ΔS = -250.0 J mol^-1 K^-1, T = 298 K. Calculate ΔG.",
      data: ["Expected conclusion: feasible or not feasible?"],
      hint: "Convert -250.0 J mol^-1 K^-1 into -0.2500 kJ mol^-1 K^-1.",
      solution: [
        "\\Delta S = -0.2500\\ \\mathrm{kJ\\ mol^{-1}\\ K^{-1}}",
        "\\Delta G = -120.0 - 298(-0.2500)",
        "\\Delta G = -45.5\\ \\mathrm{kJ\\ mol^{-1}}",
        "\\Delta G < 0\\ \\mathrm{so\\ it\\ is\\ feasible.}",
      ],
      check: {
        mode: "numeric",
        answerParts: [
          {
            id: "delta-g",
            label: "ΔG",
            expected: -45.5,
            tolerance: 0.4,
            closeTolerance: 2,
            unit: unitKj,
            correctFeedback: "Correct. ΔG is negative, so it is feasible.",
            closeFeedback: "Close. Check rounding and the kJ unit.",
            incorrectFeedback:
              "Not yet. Check entropy unit conversion and the minus sign in ΔH - TΔS.",
            commonMistakes: [
              {
                label: "used joules as kilojoules",
                expected: 74380,
                tolerance: 80,
                feedback:
                  "This is much too large because ΔS was used in J instead of kJ.",
              },
              {
                label: "wrong Gibbs sign",
                expected: -194.5,
                tolerance: 0.8,
                feedback:
                  "This looks like ΔH + TΔS. The formula is ΔH - TΔS.",
              },
              {
                label: "used Celsius",
                expected: -113.8,
                tolerance: 0.8,
                feedback:
                  "This looks like 25 was used for temperature. Use 298 K, not Celsius.",
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "gibbs-exercise-temperature-shift",
    section: "gibbs",
    title: "Exercise: temperature can change feasibility",
    type: "exercise",
    visualType: "gibbs",
    sceneData: gibbsScenes.calciumCarbonateHighTemperature,
    body: ["For positive ΔH and positive ΔS, higher temperature can make ΔG more negative."],
    exercise: {
      prompt: "ΔH = +178.3 kJ mol^-1 and ΔS = +160.6 J mol^-1 K^-1. Calculate ΔG at 298 K and 1500 K.",
      data: ["Give both answers in kJ mol^-1 and decide feasibility for each."],
      hint: "Convert ΔS to +0.1606 kJ mol^-1 K^-1, then run the same formula twice.",
      solution: [
        "\\Delta S = +0.1606\\ \\mathrm{kJ\\ mol^{-1}\\ K^{-1}}",
        "\\Delta G_{298} = 178.3 - 298(0.1606) = +130.4\\ \\mathrm{kJ\\ mol^{-1}}",
        "\\Delta G_{1500} = 178.3 - 1500(0.1606) = -62.6\\ \\mathrm{kJ\\ mol^{-1}}",
        "\\mathrm{At\\ 298\\ K:\\ not\\ feasible.\\ At\\ 1500\\ K:\\ feasible.}",
      ],
      check: {
        mode: "numeric",
        answerParts: [
          {
            id: "delta-g-298",
            label: "ΔG at 298 K",
            expected: 130.4,
            tolerance: 0.5,
            closeTolerance: 2,
            unit: unitKj,
            correctFeedback: "Correct for 298 K. Positive ΔG means not feasible.",
            closeFeedback: "Close for 298 K. Check rounding and units.",
            incorrectFeedback:
              "Not yet for 298 K. Convert entropy to kJ and subtract TΔS.",
            commonMistakes: [
              {
                label: "used joules as kilojoules",
                expected: -47680.5,
                tolerance: 90,
                feedback:
                  "This is a J/kJ unit mistake. Convert entropy to kJ before multiplying by T.",
              },
              {
                label: "wrong Gibbs sign",
                expected: 226.2,
                tolerance: 0.8,
                feedback:
                  "This looks like ΔH + TΔS. The Gibbs equation subtracts TΔS.",
              },
            ],
          },
          {
            id: "delta-g-1500",
            label: "ΔG at 1500 K",
            expected: -62.6,
            tolerance: 0.6,
            closeTolerance: 2,
            unit: unitKj,
            correctFeedback: "Correct for 1500 K. Negative ΔG means feasible.",
            closeFeedback: "Close for 1500 K. Check rounding and units.",
            incorrectFeedback:
              "Not yet for 1500 K. Use 1500 K and entropy in kJ mol^-1 K^-1.",
            commonMistakes: [
              {
                label: "used joules as kilojoules",
                expected: -240721.7,
                tolerance: 120,
                feedback:
                  "This is a J/kJ unit mistake. Convert entropy to kJ before multiplying by T.",
              },
              {
                label: "wrong Gibbs sign",
                expected: 419.2,
                tolerance: 0.8,
                feedback:
                  "This looks like ΔH + TΔS. Use ΔH - TΔS.",
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "gibbs-exercise-threshold",
    section: "gibbs",
    title: "Exercise: minimum feasible temperature",
    type: "exercise",
    visualType: "gibbs",
    sceneData: gibbsScenes.threshold,
    body: ["At the threshold, ΔG = 0."],
    exercise: {
      prompt: "ΔH = +95.0 kJ mol^-1 and ΔS = +220.0 J mol^-1 K^-1. Find the minimum temperature at which the reaction becomes feasible.",
      data: ["Use ΔG = 0."],
      hint: "Set 0 = ΔH - TΔS, so T = ΔH / ΔS. Convert ΔS to kJ mol^-1 K^-1 first.",
      solution: [
        "\\Delta S = +0.2200\\ \\mathrm{kJ\\ mol^{-1}\\ K^{-1}}",
        "0 = 95.0 - T(0.2200)",
        "T = \\frac{95.0}{0.2200} = 431.8\\ \\mathrm{K}",
        "\\mathrm{Minimum\\ temperature\\ is\\ about}\\ 432\\ \\mathrm{K}.",
      ],
      check: {
        mode: "numeric",
        answerParts: [
          {
            id: "temperature",
            label: "Minimum temperature",
            expected: 431.8,
            tolerance: 1.2,
            closeTolerance: 4,
            unit: unitKelvin,
            correctFeedback: "Correct. About 432 K is the threshold.",
            closeFeedback: "Close. Round to about 432 K and include Kelvin.",
            incorrectFeedback:
              "Not yet. Set ΔG equal to zero and convert entropy to kJ first.",
            commonMistakes: [
              {
                label: "used joules as kilojoules",
                expected: 0.432,
                tolerance: 0.02,
                feedback:
                  "This is a J/kJ unit mistake. Convert 220 J to 0.220 kJ before dividing.",
              },
              {
                label: "reported Celsius",
                expected: 158.8,
                tolerance: 1.2,
                feedback:
                  "This looks like Celsius. Report the thermodynamic temperature in Kelvin.",
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "mixed-method-choice",
    section: "mixed",
    title: "Mixed practice: choose the method",
    type: "exercise",
    visualType: "particles",
    body: ["Start by identifying what kind of data you have."],
    exercise: {
      prompt: "A question gives average C-H, O=O, C=O, and O-H bond enthalpies. Which method should you use?",
      hint: "The data are about individual bonds rather than whole substances.",
      solution: [
        "\\mathrm{Use\\ the\\ average\\ bond\\ enthalpy\\ method.}",
        "\\Delta H = \\sum \\mathrm{bonds\\ broken} - \\sum \\mathrm{bonds\\ formed}",
      ],
      check: {
        mode: "choice",
        expectedChoiceId: "bond",
        choices: [
          { id: "formation", label: "Formation enthalpy" },
          { id: "bond", label: "Average bond enthalpy" },
          { id: "entropy", label: "Entropy" },
          { id: "gibbs", label: "Gibbs free energy" },
        ],
        correctFeedback: "Correct. Bond data points to the bond enthalpy method.",
        incorrectFeedback:
          "Not this time. Choose the method that uses individual bonds broken and formed.",
      },
    },
  },
  {
    id: "mixed-formation",
    section: "mixed",
    title: "Mixed practice: quick formation calculation",
    type: "exercise",
    visualType: "formation",
    sceneData: formationScenes.waterFormation,
    body: ["A compact products-minus-reactants check."],
    equations: [
      {
        latex: "\\mathrm{H_2(g) + \\frac{1}{2}O_2(g) \\rightarrow H_2O(l)}",
      },
    ],
    exercise: {
      prompt: "Use ΔH°f(H2O(l)) = -285.8 kJ mol^-1. H2(g) and O2(g) are elements in standard states. Calculate ΔH°rxn.",
      hint: "Elements in their standard states have ΔH°f = 0.",
      solution: [
        "\\Delta H^\\circ = [-285.8] - [0 + \\frac{1}{2}(0)]",
        "\\Delta H^\\circ = -285.8\\ \\mathrm{kJ\\ mol^{-1}}",
      ],
      check: {
        mode: "numeric",
        answerParts: [
          {
            id: "delta-h",
            label: "ΔH°rxn",
            expected: -285.8,
            tolerance: 0.4,
            closeTolerance: 2,
            unit: unitKj,
            correctFeedback:
              "Correct. The elements contribute zero in their standard states.",
            closeFeedback: "Close. Check rounding and the kJ unit.",
            incorrectFeedback:
              "Not yet. Remember that standard-state elements have ΔH°f = 0.",
            commonMistakes: [
              {
                label: "reversed",
                expected: 285.8,
                feedback:
                  "The sign is reversed. Use products minus reactants.",
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "mixed-gibbs-unit",
    section: "mixed",
    title: "Mixed practice: Gibbs unit conversion",
    type: "exercise",
    visualType: "gibbs",
    sceneData: gibbsScenes.mixedUnitConversion,
    body: ["This one is designed to catch the entropy unit conversion."],
    exercise: {
      prompt: "ΔH = -40.0 kJ mol^-1, ΔS = -120.0 J mol^-1 K^-1, T = 310 K. Calculate ΔG.",
      hint: "Use ΔS = -0.1200 kJ mol^-1 K^-1.",
      solution: [
        "\\Delta G = -40.0 - 310(-0.1200)",
        "\\Delta G = -40.0 + 37.2",
        "\\Delta G = -2.8\\ \\mathrm{kJ\\ mol^{-1}}",
      ],
      check: {
        mode: "numeric",
        answerParts: [
          {
            id: "delta-g",
            label: "ΔG",
            expected: -2.8,
            tolerance: 0.3,
            closeTolerance: 1,
            unit: unitKj,
            correctFeedback: "Correct. Small and negative, so feasible.",
            closeFeedback: "Close. Check rounding and units.",
            incorrectFeedback:
              "Not yet. Convert J to kJ before multiplying by temperature.",
            commonMistakes: [
              {
                label: "used joules as kilojoules",
                expected: 37160,
                tolerance: 80,
                feedback:
                  "This is the classic J/kJ mistake. Convert entropy to kJ mol^-1 K^-1 first.",
              },
              {
                label: "wrong Gibbs sign",
                expected: -77.2,
                tolerance: 0.5,
                feedback:
                  "This looks like ΔH + TΔS. Use ΔH - TΔS.",
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "mixed-conceptual-high-temperature",
    section: "mixed",
    title: "Mixed practice: high temperature feasibility",
    type: "exercise",
    visualType: "gibbs",
    sceneData: gibbsScenes.highTemperatureConcept,
    body: ["Explain the idea in one or two sentences."],
    exercise: {
      prompt: "Why can a reaction with positive ΔH and positive ΔS become feasible at high temperature?",
      hint: "Look at the -TΔS term in ΔG = ΔH - TΔS.",
      solution: [
        "\\mathrm{When}\\ \\Delta S > 0,\\ \\mathrm{the}\\ -T\\Delta S\\ \\mathrm{term\\ becomes\\ more\\ negative\\ as}\\ T\\ \\mathrm{increases.}",
        "\\mathrm{At\\ high\\ enough\\ temperature,\\ it\\ can\\ outweigh\\ the\\ positive}\\ \\Delta H\\ \\mathrm{and\\ make}\\ \\Delta G < 0.",
      ],
      check: {
        mode: "text",
        keywords: ["temperature", "entropy", "tds", "outweigh", "negative"],
        minMatches: 3,
        correctFeedback:
          "Good explanation. You connected positive entropy to the increasingly negative -TΔS term.",
        closeFeedback:
          "Almost there. Make sure you mention that -TΔS grows more negative as temperature rises.",
        incorrectFeedback:
          "Not yet. Use the equation ΔG = ΔH - TΔS and focus on the sign of ΔS.",
        sampleAnswer:
          "Because ΔS is positive, increasing T makes -TΔS more negative. At high enough temperature, this can outweigh the positive ΔH and make ΔG negative.",
      },
    },
  },
  {
    id: "summary-finish",
    section: "summary",
    title: "Summary",
    type: "summary",
    visualType: "summary",
    body: [
      "The same pattern appears again and again: choose the data source, apply coefficients, keep units consistent, and let the sign tell the story.",
    ],
    summaryRows: [
      {
        method: "Formation enthalpy",
        formula:
          "\\Delta H^\\circ_{\\mathrm{rxn}} = \\Sigma\\Delta H^\\circ_f(\\mathrm{products}) - \\Sigma\\Delta H^\\circ_f(\\mathrm{reactants})",
        dataNeeded: "Standard enthalpies of formation",
        commonMistake: "Forgetting coefficients or ΔH°f = 0 for standard-state elements",
      },
      {
        method: "Bond enthalpy",
        formula:
          "\\Delta H = \\Sigma\\mathrm{bonds\\ broken} - \\Sigma\\mathrm{bonds\\ formed}",
        dataNeeded: "Average bond enthalpies and bond counts",
        commonMistake: "Counting molecules but not individual bonds",
      },
      {
        method: "Entropy",
        formula:
          "\\Delta S^\\circ_{\\mathrm{rxn}} = \\Sigma S^\\circ(\\mathrm{products}) - \\Sigma S^\\circ(\\mathrm{reactants})",
        dataNeeded: "Standard molar entropies",
        commonMistake: "Dropping units of J mol^-1 K^-1",
      },
      {
        method: "Gibbs free energy",
        formula: "\\Delta G = \\Delta H - T\\Delta S",
        dataNeeded: "ΔH, ΔS, and temperature in Kelvin",
        commonMistake: "Using entropy in J with enthalpy in kJ",
      },
    ],
  },
];

export const firstStepIndexBySection = lessonSections.reduce(
  (acc, section) => {
    const index = thermoLesson.findIndex((step) => step.section === section.id);
    acc[section.id] = Math.max(index, 0);
    return acc;
  },
  {} as Record<LessonSectionId, number>,
);
