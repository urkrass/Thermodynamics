import { extent, max, sum } from "d3-array";
import {
  forceCollide,
  forceSimulation,
  forceX,
  forceY,
  type SimulationNodeDatum,
} from "d3-force";
import { interpolateRgb } from "d3-interpolate";
import { scaleLinear as d3ScaleLinear } from "d3-scale";

export type SceneTone = "teal" | "amber" | "blue" | "rose" | "slate";

export type SceneTerm = {
  label: string;
  value: number;
  coefficient?: number;
  tone?: SceneTone;
};

export type FormationSceneData = {
  kind: "formation";
  reactants: SceneTerm[];
  products: SceneTerm[];
  unit?: string;
};

export type BondSceneData = {
  kind: "bonds";
  brokenBonds: SceneTerm[];
  formedBonds: SceneTerm[];
  unit?: string;
};

export type EntropySceneData = {
  kind: "entropy";
  entropyChange: number;
  reactantParticles: number;
  productParticles: number;
};

export type GibbsSceneData = {
  kind: "gibbs";
  deltaH: number;
  deltaS: number;
  temperature: number;
};

export type SceneData =
  | FormationSceneData
  | BondSceneData
  | EntropySceneData
  | GibbsSceneData;

export type EnergySegment = {
  id: string;
  label: string;
  start: number;
  end: number;
  value: number;
  tone: SceneTone;
};

export type EntropyParticle = {
  id: string;
  orderedX: number;
  orderedY: number;
  dispersedX: number;
  dispersedY: number;
  radius: number;
  tone: SceneTone;
};

export type FieldParticle = {
  id: string;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  radius: number;
  opacity: number;
  fill: string;
};

export type BondMarker = {
  id: string;
  x: number;
  y: number;
  label: string;
  tone: SceneTone;
  stagger: number;
};

type ForceNode = SimulationNodeDatum & {
  id: string;
  targetX: number;
  targetY: number;
  radius: number;
};

const tones: Record<SceneTone, { fill: string; soft: string; stroke: string }> = {
  teal: { fill: "#2b8f8a", soft: "#e7f4f2", stroke: "#8ccbc7" },
  amber: { fill: "#c78320", soft: "#fff4dd", stroke: "#ecc981" },
  blue: { fill: "#517da5", soft: "#edf5fb", stroke: "#a7bfd5" },
  rose: { fill: "#b85c6a", soft: "#fff0f2", stroke: "#e4a7b0" },
  slate: { fill: "#64727c", soft: "#f2f6f8", stroke: "#cbd6dc" },
};

export function toneColor(tone: SceneTone, variant: "fill" | "soft" | "stroke" = "fill") {
  return tones[tone][variant];
}

export function contribution(term: SceneTerm) {
  return term.value * (term.coefficient ?? 1);
}

export function totalContribution(terms: SceneTerm[]) {
  return sum(terms, contribution);
}

export function displayTermLabel(term: SceneTerm) {
  const coefficient = term.coefficient ?? 1;
  return coefficient === 1 ? term.label : `${coefficient}${term.label}`;
}

export function cumulativeEnergySegments(terms: SceneTerm[], fallbackTone: SceneTone) {
  let current = 0;

  return terms.map((term, index) => {
    const value = contribution(term);
    const start = current;
    const end = current + value;
    current = end;

    return {
      id: `${term.label}-${index}`,
      label: displayTermLabel(term),
      start,
      end,
      value,
      tone: term.tone ?? fallbackTone,
    } satisfies EnergySegment;
  });
}

export function energyDomain(termGroups: SceneTerm[][], minimumSpan = 80): [number, number] {
  const values = termGroups.flatMap((terms) => {
    let current = 0;
    const partials = [0];

    terms.forEach((term) => {
      current += contribution(term);
      partials.push(current);
    });

    return partials;
  });

  const [low = -minimumSpan / 2, high = minimumSpan / 2] = extent(values);
  const span = Math.max(high - low, minimumSpan);
  const padding = span * 0.14;

  return [Math.min(low - padding, -1), Math.max(high + padding, 1)];
}

export function valueDomain(values: number[], minimumSpan = 80): [number, number] {
  const [low = -minimumSpan / 2, high = minimumSpan / 2] = extent(values);
  const middle = (low + high) / 2;
  const span = Math.max(high - low, minimumSpan);
  const padding = span * 0.18;

  return [middle - span / 2 - padding, middle + span / 2 + padding];
}

export function formatSceneNumber(value: number, digits = 1) {
  const rounded = Number(value.toFixed(digits));
  if (Object.is(rounded, -0)) {
    return "0.0";
  }

  return rounded.toFixed(digits);
}

export function formatSignedSceneNumber(value: number, digits = 1) {
  const formatted = formatSceneNumber(value, digits);
  return value > 0 ? `+${formatted}` : formatted;
}

export function formatSvgUnit(unit = "kJ mol^-1") {
  return unit.replace(/\^-1/g, "⁻¹");
}

export function gibbsTerms(deltaH: number, deltaS: number, temperature: number) {
  const tDeltaS = temperature * deltaS;
  const deltaG = deltaH - tDeltaS;

  return {
    tDeltaS,
    deltaG,
    feasibleLabel:
      Math.abs(deltaG) < 0.1
        ? "equilibrium"
        : deltaG < 0
          ? "feasible"
          : "not feasible",
  };
}

export function gibbsTiltAngle(deltaG: number) {
  return d3ScaleLinear([-180, 0, 180], [12, 0, -12]).clamp(true)(deltaG);
}

export function gibbsSignalColor(deltaG: number) {
  const colorScale = d3ScaleLinear([-90, 90], [0, 1]).clamp(true);
  return interpolateRgb("#2b8f8a", "#b85c6a")(colorScale(deltaG));
}

export function maxMagnitude(values: number[]) {
  return max(values.map((value) => Math.abs(value))) ?? 1;
}

export function createBondCountMarkers({
  terms,
  width,
  y,
  fallbackTone,
}: {
  terms: SceneTerm[];
  width: number;
  y: number;
  fallbackTone: SceneTone;
}) {
  const labels = terms.flatMap((term) =>
    Array.from({ length: Math.max(1, Math.round(term.coefficient ?? 1)) }, (_, index) => ({
      label: term.label,
      tone: term.tone ?? fallbackTone,
      index,
    })),
  );
  const xScale = d3ScaleLinear([0, Math.max(labels.length - 1, 1)], [22, width - 22]);

  return labels.map((item, index) => ({
    id: `${item.label}-${item.index}-${index}`,
    x: xScale(index),
    y,
    label: item.label,
    tone: item.tone,
    stagger: index * 0.045,
  })) satisfies BondMarker[];
}

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function createParticleFieldNodes({
  count = 12,
  width,
  height,
  seed = 9,
}: {
  count?: number;
  width: number;
  height: number;
  seed?: number;
}) {
  const random = seededRandom(seed);
  const colorBlend = interpolateRgb("#2b8f8a", "#517da5");

  return Array.from({ length: count }, (_, index) => {
    const lane = index / Math.max(count - 1, 1);
    const x = 30 + lane * (width - 60) + (random() - 0.5) * 16;
    const y = 44 + random() * (height - 82);

    return {
      id: `field-${index}`,
      x,
      y,
      driftX: (random() - 0.5) * 12,
      driftY: -7 - random() * 8,
      radius: 4.8 + random() * 2.6,
      opacity: 0.45 + random() * 0.32,
      fill: colorBlend(index / Math.max(count - 1, 1)),
    } satisfies FieldParticle;
  });
}

export function createEntropyParticles({
  count,
  width,
  height,
  seed = 21,
}: {
  count: number;
  width: number;
  height: number;
  seed?: number;
}) {
  const random = seededRandom(seed);
  const columns = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / columns);
  const centerX = width * 0.31;
  const centerY = height * 0.52;
  const spacing = 13;

  const nodes: ForceNode[] = Array.from({ length: count }, (_, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const orderedX = centerX + (col - (columns - 1) / 2) * spacing;
    const orderedY = centerY + (row - (rows - 1) / 2) * spacing;

    return {
      id: `entropy-${index}`,
      x: orderedX,
      y: orderedY,
      targetX: 48 + random() * (width - 96),
      targetY: 38 + random() * (height - 76),
      radius: 5.6 + random() * 1.7,
    };
  });

  const simulation = forceSimulation(nodes)
    .randomSource(random)
    .force("x", forceX<ForceNode>((node) => node.targetX).strength(0.16))
    .force("y", forceY<ForceNode>((node) => node.targetY).strength(0.16))
    .force("collide", forceCollide<ForceNode>((node) => node.radius + 3.8))
    .stop();

  simulation.tick(150);

  return nodes.map((node, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);

    return {
      id: node.id,
      orderedX: centerX + (col - (columns - 1) / 2) * spacing,
      orderedY: centerY + (row - (rows - 1) / 2) * spacing,
      dispersedX: node.x ?? node.targetX,
      dispersedY: node.y ?? node.targetY,
      radius: node.radius,
      tone: index % 3 === 0 ? "teal" : index % 3 === 1 ? "blue" : "amber",
    } satisfies EntropyParticle;
  });
}
