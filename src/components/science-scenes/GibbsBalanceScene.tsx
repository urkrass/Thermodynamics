"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { motion, useAnimate } from "motion/react";
import { useEffect, useState } from "react";
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
  const [scope, animate] = useAnimate<SVGSVGElement>();
  const [settledPhase, setSettledPhase] = useState(0);
  const { tDeltaS, deltaG, feasibleLabel } = gibbsTerms(deltaH, deltaS, temperature);
  const signalColor = gibbsSignalColor(deltaG);
  const tilt = gibbsTiltAngle(deltaG);
  const magnitude = maxMagnitude([deltaH, tDeltaS, deltaG]);
  const termScale = scaleLinear({
    domain: [0, magnitude],
    range: [70, 170],
  });
  const gaugeLimit = Math.max(80, magnitude);
  const gaugeScale = scaleLinear({
    domain: [-gaugeLimit, gaugeLimit],
    range: [180, 540],
  });
  const hLength = termScale(Math.abs(deltaH));
  const tsLength = termScale(Math.abs(tDeltaS));
  const gaugeX = gaugeScale(deltaG);
  const markerOffset = gaugeX - 360;
  const visiblePhase = reduceMotion ? 6 : settledPhase;
  const formulaOpacity = visiblePhase >= 1 ? 1 : 0;
  const termsOpacity = visiblePhase >= 2 ? 1 : 0;
  const resultOpacity = visiblePhase >= 3 ? 1 : 0;
  const beamOpacity = visiblePhase >= 4 ? 1 : 0;
  const markerOpacity = visiblePhase >= 5 ? 0.95 : 0.2;
  const feasibilityOpacity = visiblePhase >= 6 ? 1 : 0;
  const termLinesDrawn = visiblePhase >= 2 ? 1 : 0;
  const gaugeDrawn = visiblePhase >= 4 ? 1 : 0;

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    let cancelled = false;
    const settle = (phase: number) => {
      if (!cancelled) {
        setSettledPhase(phase);
      }
    };

    async function runSequence() {
      await animate(
        "[data-gibbs-formula]",
        { opacity: [0, 1], y: [4, 0] },
        { duration: 0.28, ease: "easeOut" },
      );

      if (cancelled) {
        return;
      }
      settle(1);

      await Promise.all([
        animate(
          "[data-gibbs-dh-line]",
          { pathLength: 1 },
          { duration: 0.52, ease: "circOut" },
        ),
        animate(
          "[data-gibbs-tds-line]",
          { pathLength: 1 },
          { duration: 0.52, delay: 0.08, ease: "circOut" },
        ),
        animate(
          "[data-gibbs-terms]",
          { opacity: [0, 1], y: [6, 0] },
          { duration: 0.34, delay: 0.12, ease: "easeOut" },
        ),
      ]);

      if (cancelled) {
        return;
      }
      settle(2);

      await animate(
        "[data-gibbs-result]",
        { opacity: [0, 1], y: [6, 0] },
        { duration: 0.34, ease: "easeOut" },
      );

      if (cancelled) {
        return;
      }
      settle(3);

      await Promise.all([
        animate(
          "[data-gibbs-beam]",
          { opacity: [0, 1], rotate: [0, tilt] },
          { duration: 0.58, ease: [0.2, 0.8, 0.2, 1] },
        ),
        animate(
          "[data-gibbs-gauge-track]",
          { pathLength: 1 },
          { duration: 0.44, delay: 0.12, ease: "circOut" },
        ),
      ]);

      if (cancelled) {
        return;
      }
      settle(4);

      await animate(
        "[data-gibbs-marker]",
        { opacity: [0.2, 0.95], x: [0, markerOffset] },
        { type: "spring", visualDuration: 0.42, bounce: 0.08 },
      );

      if (cancelled) {
        return;
      }
      settle(5);

      await animate(
        "[data-gibbs-feasibility]",
        { opacity: [0, 1], y: [4, 0] },
        { duration: 0.24, ease: "easeOut" },
      );
      settle(6);
    }

    runSequence();

    return () => {
      cancelled = true;
    };
  }, [animate, deltaG, deltaH, deltaS, markerOffset, reduceMotion, temperature, tilt]);

  return (
    <svg
      ref={scope}
      viewBox="0 0 720 190"
      className="h-full w-full overflow-visible"
      role="img"
      aria-label="Gibbs free energy balance visualization"
    >
      <Group>
        <g
          data-gibbs-formula
          style={{ opacity: formulaOpacity, transform: `translateY(${formulaOpacity ? 0 : 4}px)` }}
        >
          <text x={360} y={24} textAnchor="middle" fontSize={17} fill="#64727c">
            ΔG = ΔH − TΔS
          </text>
        </g>

        <g
          data-gibbs-terms
          style={{ opacity: termsOpacity, transform: `translateY(${termsOpacity ? 0 : 6}px)` }}
        >
          <text x={178} y={50} textAnchor="middle" fontSize={15} fill="#b85c6a">
            ΔH
          </text>
          <text x={542} y={50} textAnchor="middle" fontSize={15} fill="#2b8f8a">
            TΔS
          </text>
          <text x={360} y={47} textAnchor="middle" fontSize={13} fill="#8a98a3">
            subtracts
          </text>
          <text x={360 - hLength / 2} y={88} textAnchor="middle" fontSize={14} fill="#172026">
            {formatSignedSceneNumber(deltaH)}
          </text>
          <text x={360 + tsLength / 2} y={88} textAnchor="middle" fontSize={14} fill="#172026">
            {formatSignedSceneNumber(tDeltaS)}
          </text>
        </g>

        <motion.line
          data-gibbs-dh-line
          x1={360}
          x2={360 - hLength}
          y1={66}
          y2={66}
          stroke="#b85c6a"
          strokeWidth={5}
          strokeLinecap="round"
          initial={false}
          style={{ pathLength: termLinesDrawn }}
        />
        <motion.line
          data-gibbs-tds-line
          x1={360}
          x2={360 + tsLength}
          y1={66}
          y2={66}
          stroke="#2b8f8a"
          strokeWidth={5}
          strokeLinecap="round"
          initial={false}
          style={{ pathLength: termLinesDrawn }}
        />
        <circle cx={360} cy={66} r={5} fill="#64727c" />

        <text
          data-gibbs-result
          x={360}
          y={113}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={24}
          fontWeight={650}
          fill="#172026"
          style={{ opacity: resultOpacity, transform: `translateY(${resultOpacity ? 0 : 6}px)` }}
        >
          {`ΔG = ${formatSignedSceneNumber(deltaG)} kJ mol⁻¹`}
        </text>

        <g
          data-gibbs-beam
          style={{
            opacity: beamOpacity,
            transform: `rotate(${visiblePhase >= 4 ? tilt : 0}deg)`,
            transformBox: "fill-box",
            transformOrigin: "360px 149px",
          }}
        >
          <line x1={162} y1={149} x2={558} y2={149} stroke="#64727c" strokeWidth={4.5} strokeLinecap="round" />
          <circle cx={360} cy={149} r={8} fill="#172026" />
          <line x1={212} x2={212} y1={138} y2={160} stroke="#b85c6a" strokeWidth={2.8} />
          <line x1={508} x2={508} y1={138} y2={160} stroke="#2b8f8a" strokeWidth={2.8} />
        </g>

        <motion.line
          data-gibbs-gauge-track
          x1={180}
          x2={540}
          y1={174}
          y2={174}
          stroke="#dbe5e9"
          strokeWidth={3.5}
          strokeLinecap="round"
          initial={false}
          style={{ pathLength: gaugeDrawn }}
        />
        <g
          data-gibbs-marker
          style={{
            opacity: markerOpacity,
            transform: `translateX(${visiblePhase >= 5 ? markerOffset : 0}px)`,
            transformBox: "fill-box",
            transformOrigin: "360px 174px",
          }}
        >
          <circle cx={360} cy={174} r={7} fill={signalColor} />
        </g>
        <text x={180} y={188} fontSize={12} fill="#64727c">
          feasible
        </text>
        <text x={470} y={188} fontSize={12} fill="#64727c">
          not feasible
        </text>
        <text
          data-gibbs-feasibility
          x={360}
          y={133}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={15}
          fill={signalColor}
          style={{ opacity: feasibilityOpacity, transform: `translateY(${feasibilityOpacity ? 0 : 4}px)` }}
        >
          {`${feasibleLabel} at ${temperature} K`}
        </text>
      </Group>
    </svg>
  );
}
