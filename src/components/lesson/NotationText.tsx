"use client";

import { useMemo } from "react";
import katex from "katex";

type NotationTextProps = {
  text: string;
  className?: string;
};

const unitPatterns = [
  {
    pattern: /kJ mol\^-1 K\^-1/g,
    latex: "\\mathrm{kJ\\ mol^{-1}\\ K^{-1}}",
  },
  {
    pattern: /J mol\^-1 K\^-1/g,
    latex: "\\mathrm{J\\ mol^{-1}\\ K^{-1}}",
  },
  {
    pattern: /kJ mol\^-1/g,
    latex: "\\mathrm{kJ\\ mol^{-1}}",
  },
  {
    pattern: /J mol\^-1/g,
    latex: "\\mathrm{J\\ mol^{-1}}",
  },
];

const symbolPatterns = [
  { pattern: /ΔH°rxn/g, latex: "\\Delta H^\\circ_{\\mathrm{rxn}}" },
  { pattern: /ΔH°f/g, latex: "\\Delta H^\\circ_f" },
  { pattern: /ΔH°/g, latex: "\\Delta H^\\circ" },
  { pattern: /ΔS°rxn/g, latex: "\\Delta S^\\circ_{\\mathrm{rxn}}" },
  { pattern: /ΔS°/g, latex: "\\Delta S^\\circ" },
  { pattern: /ΔH/g, latex: "\\Delta H" },
  { pattern: /ΔS/g, latex: "\\Delta S" },
  { pattern: /ΔG/g, latex: "\\Delta G" },
];

const speciesPattern =
  /\b(?:C2H4|CaCO3|CaO|CH4|CO2|H2O|O2|N2|H2|NH3|HCl|Cl2)(?:\([gls]\))?/g;
const bondPattern = /\b(?:H-H|Cl-Cl|H-Cl|C-H|O=O|C=O|O-H|N≡N|N-H)\b/g;
const coefficientSpeciesPattern =
  /\b(?:2|3|4|6)(?:CO2|H2O|O2|NH3|H2|N-H|O-H)\b/g;

type Segment = {
  kind: "text" | "math";
  value: string;
};

function formulaToLatex(formula: string) {
  return formula
    .replace(/([A-Z][a-z]?)(\d+)/g, "$1_$2")
    .replace(/\((g|l|s)\)/g, "($1)")
    .replace(/-/g, "{-}")
    .replace(/=/g, "{=}")
    .replace(/≡/g, "{\\equiv}");
}

function matchToLatex(match: string) {
  const coefficientMatch = match.match(/^(\d)(.+)$/);
  if (coefficientMatch) {
    return `${coefficientMatch[1]}\\mathrm{${formulaToLatex(coefficientMatch[2])}}`;
  }

  return `\\mathrm{${formulaToLatex(match)}}`;
}

function addPatternSegments(
  source: Segment[],
  pattern: RegExp,
  getLatex: (match: string) => string,
) {
  return source.flatMap((segment) => {
    if (segment.kind === "math") {
      return [segment];
    }

    const nextSegments: Segment[] = [];
    let lastIndex = 0;

    for (const match of segment.value.matchAll(pattern)) {
      const matchedText = match[0];
      const matchIndex = match.index ?? 0;

      if (matchIndex > lastIndex) {
        nextSegments.push({
          kind: "text",
          value: segment.value.slice(lastIndex, matchIndex),
        });
      }

      nextSegments.push({
        kind: "math",
        value: getLatex(matchedText),
      });
      lastIndex = matchIndex + matchedText.length;
    }

    if (lastIndex < segment.value.length) {
      nextSegments.push({
        kind: "text",
        value: segment.value.slice(lastIndex),
      });
    }

    return nextSegments.length ? nextSegments : [segment];
  });
}

function buildSegments(text: string) {
  let segments: Segment[] = [{ kind: "text", value: text }];

  for (const { pattern, latex } of unitPatterns) {
    segments = addPatternSegments(segments, pattern, () => latex);
  }

  for (const { pattern, latex } of symbolPatterns) {
    segments = addPatternSegments(segments, pattern, () => latex);
  }

  segments = addPatternSegments(segments, coefficientSpeciesPattern, matchToLatex);
  segments = addPatternSegments(segments, speciesPattern, matchToLatex);
  segments = addPatternSegments(segments, bondPattern, matchToLatex);

  return segments;
}

function renderMath(latex: string) {
  return katex.renderToString(latex, {
    displayMode: false,
    throwOnError: false,
    strict: "ignore",
  });
}

export function NotationText({ text, className = "" }: NotationTextProps) {
  const segments = useMemo(() => buildSegments(text), [text]);

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.kind === "math" ? (
          <span
            // Stable enough for immutable lesson text, avoids leaking raw notation.
            key={`${segment.value}-${index}`}
            className="equation-inline"
            dangerouslySetInnerHTML={{ __html: renderMath(segment.value) }}
          />
        ) : (
          <span key={`${segment.value}-${index}`}>{segment.value}</span>
        ),
      )}
    </span>
  );
}
