"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { motion } from "motion/react";
import {
  cumulativeEnergySegments,
  formatSignedSceneNumber,
  formatSvgUnit,
  toneColor,
  totalContribution,
  type SceneTerm,
  type SceneTone,
} from "@/components/science-scenes/sceneMath";

type EnergyStackProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  terms: SceneTerm[];
  domain: [number, number];
  fallbackTone: SceneTone;
  unit?: string;
  reduceMotion: boolean;
  totalPrefix?: string;
};

export function EnergyStack({
  x,
  y,
  width,
  height,
  title,
  terms,
  domain,
  fallbackTone,
  unit,
  reduceMotion,
  totalPrefix = "total",
}: EnergyStackProps) {
  const yScale = scaleLinear({
    domain,
    range: [height, 0],
  });
  const segments = cumulativeEnergySegments(terms, fallbackTone);
  const total = totalContribution(terms);
  const zeroY = yScale(0);
  const barWidth = width * 0.58;
  const barX = (width - barWidth) / 2;

  return (
    <Group left={x} top={y}>
      <text
        x={width / 2}
        y={0}
        textAnchor="middle"
        fontSize={12}
        fill="#64727c"
      >
        {title}
      </text>
      <line
        x1={6}
        x2={width - 6}
        y1={zeroY}
        y2={zeroY}
        stroke="#dbe5e9"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {segments.map((segment, index) => {
        const y0 = yScale(segment.start);
        const y1 = yScale(segment.end);
        const segmentY = Math.min(y0, y1);
        const segmentHeight = Math.max(1.5, Math.abs(y1 - y0));
        const labelFits = segmentHeight > 17 && barWidth > 34;
        const originY = segment.end >= segment.start ? y0 : y1;

        return (
          <motion.g
            key={segment.id}
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    scaleY: 0.12,
                  }
            }
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 0.56,
              delay: index * 0.06,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            style={{
              transformBox: "fill-box",
              transformOrigin: `${barX + barWidth / 2}px ${originY}px`,
            }}
          >
            <rect
              x={barX}
              y={segmentY}
              width={barWidth}
              height={segmentHeight}
              fill={toneColor(segment.tone, "soft")}
              stroke={toneColor(segment.tone, "stroke")}
              strokeWidth={1}
            />
            {labelFits ? (
              <text
                x={width / 2}
                y={segmentY + segmentHeight / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10.5}
                fill="#172026"
              >
                {segment.label}
              </text>
            ) : null}
          </motion.g>
        );
      })}
      <text
        x={width / 2}
        y={height + 16}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={11}
        fill="#172026"
      >
        {`${totalPrefix} ${formatSignedSceneNumber(total)} ${formatSvgUnit(unit)}`}
      </text>
    </Group>
  );
}
