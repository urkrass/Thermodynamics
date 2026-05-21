"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { VisualType } from "@/data/thermoLesson";

type ScientificVisualProps = {
  type?: VisualType;
};

const particles = [
  { cx: 38, cy: 42, delay: 0 },
  { cx: 74, cy: 65, delay: 0.4 },
  { cx: 118, cy: 38, delay: 0.8 },
  { cx: 151, cy: 84, delay: 0.2 },
  { cx: 198, cy: 50, delay: 0.6 },
  { cx: 226, cy: 104, delay: 1 },
];

function ParticleVisual({ reduce }: { reduce: boolean }) {
  return (
    <svg viewBox="0 0 280 170" className="h-full w-full" role="img" aria-label="Gently moving particles">
      <path
        d="M22 126 C74 78, 112 140, 164 90 S232 58, 260 104"
        fill="none"
        stroke="#d3e7e5"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {particles.map((particle) => (
        <motion.g
          key={`${particle.cx}-${particle.cy}`}
          animate={
            reduce
              ? undefined
              : {
                  y: [0, -10, 0],
                  opacity: [0.5, 0.88, 0.5],
                }
          }
          transition={{
            duration: 4.8,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        >
          <circle
            cx={particle.cx}
            cy={particle.cy}
            r="7"
            fill="#2b8f8a"
            opacity="0.72"
          />
        </motion.g>
      ))}
      <circle cx="222" cy="106" r="26" fill="#fff4dd" opacity="0.75" />
      <circle cx="222" cy="106" r="10" fill="#c78320" opacity="0.64" />
    </svg>
  );
}

function FormationVisual({ reduce }: { reduce: boolean }) {
  return (
    <svg viewBox="0 0 280 170" className="h-full w-full" role="img" aria-label="Products minus reactants diagram">
      <text x="26" y="44" fill="#64727c" fontSize="13">
        reactants
      </text>
      <text x="177" y="44" fill="#64727c" fontSize="13">
        products
      </text>
      <motion.g
        animate={reduce ? undefined : { x: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="24" y="64" width="76" height="34" rx="17" fill="#edf5fb" />
        <text x="42" y="86" fill="#172026" fontSize="16">
          CH<tspan baselineShift="sub" fontSize="11">4</tspan>
        </text>
        <rect x="34" y="106" width="56" height="28" rx="14" fill="#f2f6f8" />
        <text x="45" y="125" fill="#172026" fontSize="14">
          2O<tspan baselineShift="sub" fontSize="10">2</tspan>
        </text>
      </motion.g>
      <text x="130" y="98" fill="#2b8f8a" fontSize="32">
        -
      </text>
      <motion.g
        animate={reduce ? undefined : { x: [0, 4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="176" y="62" width="72" height="34" rx="17" fill="#e7f4f2" />
        <text x="194" y="84" fill="#172026" fontSize="16">
          CO<tspan baselineShift="sub" fontSize="11">2</tspan>
        </text>
        <rect x="168" y="106" width="92" height="28" rx="14" fill="#fff4dd" />
        <text x="184" y="125" fill="#172026" fontSize="14">
          2H<tspan baselineShift="sub" fontSize="10">2</tspan>O
        </text>
      </motion.g>
    </svg>
  );
}

function BondVisual({ reduce }: { reduce: boolean }) {
  return (
    <svg viewBox="0 0 280 170" className="h-full w-full" role="img" aria-label="Bonds breaking and forming">
      <motion.line
        x1="52"
        y1="70"
        x2="112"
        y2="70"
        stroke="#c78320"
        strokeWidth="5"
        strokeLinecap="round"
        animate={reduce ? undefined : { x1: [52, 42, 52], x2: [112, 122, 112] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="44" cy="70" r="17" fill="#fff4dd" />
      <circle cx="120" cy="70" r="17" fill="#fff4dd" />
      <text x="39" y="75" fontSize="15" fill="#172026">
        H
      </text>
      <text x="115" y="75" fontSize="15" fill="#172026">
        H
      </text>
      <motion.g
        animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <line x1="169" y1="84" x2="230" y2="84" stroke="#2b8f8a" strokeWidth="5" strokeLinecap="round" />
        <circle cx="161" cy="84" r="17" fill="#e7f4f2" />
        <circle cx="238" cy="84" r="17" fill="#e7f4f2" />
        <text x="156" y="89" fontSize="15" fill="#172026">
          H
        </text>
        <text x="231" y="89" fontSize="15" fill="#172026">
          Cl
        </text>
      </motion.g>
      <text x="82" y="128" fontSize="13" fill="#64727c">
        broken
      </text>
      <text x="188" y="128" fontSize="13" fill="#64727c">
        formed
      </text>
    </svg>
  );
}

function EntropyVisual({ reduce }: { reduce: boolean }) {
  const spread = [
    [70, 82, 42, 48],
    [84, 84, 74, 34],
    [98, 80, 118, 58],
    [78, 102, 152, 86],
    [94, 104, 198, 56],
    [108, 96, 226, 110],
  ];

  return (
    <svg viewBox="0 0 280 170" className="h-full w-full" role="img" aria-label="Particles spreading out">
      <rect x="36" y="28" width="208" height="118" rx="28" fill="#edf5fb" opacity="0.78" />
      {spread.map(([x, y, targetX, targetY], index) => (
        <motion.g
          key={`${x}-${y}`}
          animate={
            reduce
              ? undefined
              : {
                  x: [0, targetX - x, 0],
                  y: [0, targetY - y, 0],
                }
          }
          transition={{
            duration: 6.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.16,
          }}
        >
          <circle
            cx={x}
            cy={y}
            r="7"
            fill={index % 2 === 0 ? "#517da5" : "#2b8f8a"}
            opacity="0.76"
          />
        </motion.g>
      ))}
      <text x="96" y="145" fontSize="13" fill="#64727c">
        greater dispersal
      </text>
    </svg>
  );
}

function GibbsVisual({ reduce }: { reduce: boolean }) {
  return (
    <svg viewBox="0 0 280 170" className="h-full w-full" role="img" aria-label="Gibbs energy balance">
      <line x1="70" y1="118" x2="218" y2="118" stroke="#dbe5e9" strokeWidth="5" strokeLinecap="round" />
      <motion.g
        animate={reduce ? undefined : { rotate: [-4, 4, -4] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "144px", originY: "88px" }}
      >
        <line x1="70" y1="88" x2="218" y2="88" stroke="#64727c" strokeWidth="4" strokeLinecap="round" />
        <circle cx="144" cy="88" r="7" fill="#172026" />
        <rect x="48" y="98" width="58" height="32" rx="16" fill="#fff0f2" />
        <text x="64" y="119" fontSize="14" fill="#172026">
          ΔH
        </text>
        <rect x="188" y="98" width="62" height="32" rx="16" fill="#e7f4f2" />
        <text x="201" y="119" fontSize="14" fill="#172026">
          TΔS
        </text>
      </motion.g>
      <text x="105" y="42" fontSize="30" fill="#b85c6a">
        ΔG
      </text>
      <text x="150" y="41" fontSize="18" fill="#64727c">
        &lt; 0?
      </text>
    </svg>
  );
}

function SummaryVisual() {
  const tiles: Array<[string, string, number, number]> = [
    ["ΔH°", "#e7f4f2", 34, 34],
    ["bonds", "#fff4dd", 152, 34],
    ["ΔS°", "#edf5fb", 34, 96],
    ["ΔG", "#fff0f2", 152, 96],
  ];

  return (
    <svg viewBox="0 0 280 170" className="h-full w-full" role="img" aria-label="Thermodynamics formulas summary">
      {tiles.map(([label, color, x, y]) => (
        <g key={label}>
          <rect x={x} y={y} width="94" height="42" rx="21" fill={color} />
          <text x={x + 26} y={y + 27} fontSize="15" fill="#172026">
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function ScientificVisual({ type = "particles" }: ScientificVisualProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="gentle-float mx-auto aspect-[14/9] w-full max-w-[23rem] rounded-[2rem] bg-gradient-to-br from-slate-50 to-white p-4">
      {type === "formation" ? <FormationVisual reduce={reduce} /> : null}
      {type === "bonds" ? <BondVisual reduce={reduce} /> : null}
      {type === "entropy" ? <EntropyVisual reduce={reduce} /> : null}
      {type === "gibbs" ? <GibbsVisual reduce={reduce} /> : null}
      {type === "summary" ? <SummaryVisual /> : null}
      {type === "particles" ? <ParticleVisual reduce={reduce} /> : null}
    </div>
  );
}
