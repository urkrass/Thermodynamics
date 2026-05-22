import type { SimulationSceneKind } from "@/components/design-lab/simulationVariants";

type SimulationSceneProps = {
  kind: SimulationSceneKind;
};

const gridX = [110, 190, 270, 350, 430, 510, 590];
const gridY = [92, 150, 208, 266, 324, 382];
const DELTA = "\u0394";
const DIVIDE = "\u00f7";
const particles = [
  [156, 142, 4],
  [208, 188, 3],
  [262, 128, 4],
  [328, 232, 3],
  [386, 168, 4],
  [452, 214, 3],
  [512, 142, 4],
  [566, 250, 3],
];

function Grid() {
  return (
    <g className="sim-grid">
      {gridX.map((x) => (
        <line key={`x-${x}`} x1={x} y1="72" x2={x} y2="412" />
      ))}
      {gridY.map((y) => (
        <line key={`y-${y}`} x1="78" y1={y} x2="626" y2={y} />
      ))}
    </g>
  );
}

function FormulaHeader({ label }: { label: string }) {
  return (
    <g>
      <text x="78" y="48" className="sim-title">
        {label}
      </text>
      <text x="542" y="48" textAnchor="end" className="sim-formula">
        {`${DELTA}G = ${DELTA}H - T${DELTA}S`}
      </text>
    </g>
  );
}

function BalanceScene() {
  return (
    <svg viewBox="0 0 704 480" role="img" aria-label="Gibbs balance simulation">
      <Grid />
      <FormulaHeader label="balance instrument" />
      <line x1="116" y1="350" x2="588" y2="350" className="sim-thin-line" />
      <g className="sim-beam">
        <line x1="182" y1="236" x2="522" y2="236" stroke="var(--sim-ink)" strokeWidth="5" strokeLinecap="round" />
        <line x1="352" y1="236" x2="352" y2="322" stroke="var(--sim-ink)" strokeWidth="3" />
        <path d="M310 322h84l-42 32z" fill="rgba(43,143,138,0.14)" stroke="var(--sim-accent)" />
        <circle cx="228" cy="236" r="42" fill="rgba(199,131,32,0.16)" stroke="var(--sim-warm)" strokeWidth="3" />
        <circle cx="478" cy="236" r="42" fill="rgba(43,143,138,0.14)" stroke="var(--sim-accent)" strokeWidth="3" />
        <text x="228" y="242" textAnchor="middle" className="sim-formula">
          {`${DELTA}H`}
        </text>
        <text x="478" y="242" textAnchor="middle" className="sim-formula">
          {`T${DELTA}S`}
        </text>
      </g>
      <g className="sim-marker">
        <circle cx="352" cy="392" r="10" className="sim-hot" />
      </g>
      <line x1="212" y1="392" x2="492" y2="392" stroke="var(--sim-line)" strokeWidth="4" strokeLinecap="round" />
      <text x="212" y="424" className="sim-label">feasible</text>
      <text x="452" y="424" className="sim-label">not feasible</text>
      <text x="352" y="118" textAnchor="middle" className="sim-label">beam settles after term loading</text>
    </svg>
  );
}

function LandscapeScene() {
  return (
    <svg viewBox="0 0 704 480" role="img" aria-label="Free energy landscape simulation">
      <Grid />
      <FormulaHeader label="energy surface" />
      <path
        className="sim-draw"
        d="M92 338 C150 224, 214 206, 278 254 C346 308, 412 292, 474 204 C526 128, 580 116, 634 148"
        fill="none"
        stroke="var(--sim-accent)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M112 362 C246 316, 428 334, 614 242" fill="none" stroke="var(--sim-line)" strokeWidth="1.5" />
      <path d="M118 404 C256 362, 426 384, 612 304" fill="none" stroke="var(--sim-line)" strokeWidth="1.5" />
      <g className="sim-scan">
        <circle cx="304" cy="258" r="14" fill="var(--sim-hot)" />
        <circle cx="304" cy="258" r="28" fill="none" stroke="var(--sim-hot)" opacity="0.32" />
      </g>
      <line x1="546" y1="148" x2="546" y2="292" className="sim-stroke-hot" />
      <path d="M536 282l10 14 10-14" fill="none" stroke="var(--sim-hot)" strokeWidth="3" />
      <text x="560" y="224" className="sim-label">{`${DELTA}G drop`}</text>
      <text x="112" y="376" className="sim-label">reactants</text>
      <text x="560" y="132" className="sim-label">products</text>
    </svg>
  );
}

function EntropyScene() {
  return (
    <svg viewBox="0 0 704 480" role="img" aria-label="Entropy chamber simulation">
      <FormulaHeader label="entropy chamber" />
      <rect x="98" y="116" width="508" height="250" rx="18" fill="none" stroke="var(--sim-line)" strokeWidth="2" />
      <line x1="352" y1="116" x2="352" y2="366" stroke="var(--sim-line)" strokeWidth="2" strokeDasharray="6 10" />
      <g>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <circle key={index} className="sim-particle" cx={184 + (index % 3) * 28} cy={214 + Math.floor(index / 3) * 30} r="8" />
        ))}
      </g>
      <g>
        {particles.map(([cx, cy, r], index) => (
          <circle key={index} className="sim-particle" cx={392 + (cx - 156) * 0.62} cy={142 + (cy - 128) * 0.78} r={r + 4} />
        ))}
      </g>
      <path className="sim-stroke-accent sim-draw" d="M308 242 C328 220, 374 220, 398 242" />
      <path d="M388 232l14 10-14 10" fill="none" stroke="var(--sim-accent)" strokeWidth="3" />
      <text x="210" y="394" textAnchor="middle" className="sim-label">ordered reactants</text>
      <text x="488" y="394" textAnchor="middle" className="sim-label">more accessible states</text>
      <text x="352" y="78" textAnchor="middle" className="sim-formula">{`${DELTA}S becomes a spatial expansion`}</text>
    </svg>
  );
}

function CoordinateScene() {
  return (
    <svg viewBox="0 0 704 480" role="img" aria-label="Reaction coordinate simulation">
      <Grid />
      <FormulaHeader label="reaction trace" />
      <line x1="100" y1="388" x2="620" y2="388" className="sim-thin-line" />
      <line x1="112" y1="92" x2="112" y2="400" className="sim-thin-line" />
      <path className="sim-draw" d="M124 318 C198 318, 214 132, 306 132 C416 132, 396 272, 584 272" fill="none" stroke="var(--sim-accent)" strokeWidth="4" />
      <line x1="548" y1="318" x2="548" y2="272" className="sim-stroke-hot" />
      <text x="562" y="300" className="sim-label">{`${DELTA}G`}</text>
      <text x="132" y="342" className="sim-label">reactants</text>
      <text x="548" y="252" className="sim-label">products</text>
      <circle cx="306" cy="132" r="8" className="sim-warm sim-pulse" />
    </svg>
  );
}

function VectorScene() {
  return (
    <svg viewBox="0 0 704 480" role="img" aria-label="Term vector field simulation">
      <Grid />
      <FormulaHeader label="term vectors" />
      <line x1="152" y1="284" x2="552" y2="284" className="sim-thin-line" />
      <line x1="352" y1="104" x2="352" y2="386" className="sim-thin-line" />
      <path className="sim-stroke-warm sim-draw" d="M352 284 L218 186" />
      <path className="sim-stroke-accent sim-draw" d="M352 284 L500 206" />
      <path className="sim-stroke-hot sim-draw" d="M218 186 L286 348" />
      <circle cx="286" cy="348" r="10" className="sim-hot sim-pulse" />
      <text x="202" y="176" className="sim-label">{`${DELTA}H`}</text>
      <text x="508" y="198" className="sim-label">{`T${DELTA}S`}</text>
      <text x="296" y="368" className="sim-label">{`resultant ${DELTA}G`}</text>
    </svg>
  );
}

function ThresholdScene() {
  return (
    <svg viewBox="0 0 704 480" role="img" aria-label="Thermal threshold simulation">
      <Grid />
      <FormulaHeader label="thermal threshold" />
      <line x1="120" y1="302" x2="584" y2="302" stroke="var(--sim-hot)" strokeDasharray="8 9" strokeWidth="2" />
      <rect x="170" y="238" width="68" height="64" rx="4" className="sim-warm" />
      <rect x="316" y="198" width="68" height="104" rx="4" className="sim-accent sim-heat" />
      <rect x="462" y="266" width="68" height="36" rx="4" className="sim-hot" />
      <path d="M472 166 A86 86 0 0 1 588 256" fill="none" stroke="var(--sim-line)" strokeWidth="10" strokeLinecap="round" />
      <line className="sim-scan" x1="530" y1="244" x2="566" y2="190" stroke="var(--sim-hot)" strokeWidth="5" strokeLinecap="round" />
      <text x="186" y="224" className="sim-label">{`${DELTA}H`}</text>
      <text x="302" y="178" className="sim-label">{`-T${DELTA}S grows with T`}</text>
      <text x="442" y="252" className="sim-label">{`crossing ${DELTA}G = 0`}</text>
    </svg>
  );
}

function OrbitScene() {
  return (
    <svg viewBox="0 0 704 480" role="img" aria-label="Molecular orbit lens simulation">
      <Grid />
      <FormulaHeader label="molecular lens" />
      <circle cx="352" cy="246" r="138" fill="rgba(43,143,138,0.1)" stroke="var(--sim-accent)" strokeWidth="2" />
      <circle cx="352" cy="246" r="88" fill="none" stroke="var(--sim-line)" strokeWidth="2" />
      <g className="sim-orbit">
        <circle cx="352" cy="158" r="10" className="sim-accent" />
        <circle cx="440" cy="246" r="7" className="sim-cool" />
        <circle cx="352" cy="334" r="8" className="sim-warm" />
        <circle cx="264" cy="246" r="6" className="sim-hot" />
      </g>
      <circle cx="352" cy="246" r="18" fill="var(--sim-paper)" stroke="var(--sim-accent)" strokeWidth="3" />
      <text x="352" y="252" textAnchor="middle" className="sim-formula">S</text>
      <text x="154" y="402" className="sim-label">microstate motion</text>
      <text x="436" y="402" className="sim-label">{`macroscopic ${DELTA}S`}</text>
    </svg>
  );
}

function StackScene() {
  return (
    <svg viewBox="0 0 704 480" role="img" aria-label="Enthalpy stack simulation">
      <Grid />
      <FormulaHeader label="enthalpy stack" />
      <rect x="178" y="186" width="58" height="126" rx="4" className="sim-accent sim-pulse" />
      <rect x="250" y="226" width="58" height="86" rx="4" className="sim-accent" opacity="0.72" />
      <rect x="420" y="150" width="58" height="162" rx="4" className="sim-warm" />
      <rect x="492" y="262" width="58" height="50" rx="4" className="sim-warm" opacity="0.72" />
      <line x1="144" y1="312" x2="586" y2="312" className="sim-thin-line" />
      <path className="sim-stroke-hot sim-draw" d="M336 174 L336 312 M326 174 H346 M326 312 H346" />
      <text x="206" y="342" textAnchor="middle" className="sim-label">products</text>
      <text x="486" y="342" textAnchor="middle" className="sim-label">reactants</text>
      <text x="352" y="154" textAnchor="middle" className="sim-label">{`difference becomes ${DELTA}H`}</text>
    </svg>
  );
}

function ConversionScene() {
  return (
    <svg viewBox="0 0 704 480" role="img" aria-label="Unit conversion gate simulation">
      <Grid />
      <FormulaHeader label="conversion gate" />
      <rect x="106" y="178" width="150" height="74" rx="8" fill="rgba(81,125,165,0.12)" stroke="var(--sim-cool)" />
      <rect x="454" y="178" width="150" height="74" rx="8" fill="rgba(43,143,138,0.12)" stroke="var(--sim-accent)" />
      <path className="sim-stroke-accent sim-draw" d="M256 216 H448" />
      <rect x="310" y="154" width="84" height="124" rx="12" fill="var(--sim-paper)" stroke="var(--sim-accent)" strokeWidth="3" />
      <text x="352" y="214" textAnchor="middle" className="sim-formula">{`${DIVIDE}1000`}</text>
      <text x="180" y="210" textAnchor="middle" className="sim-formula">-198.6 J</text>
      <text x="530" y="210" textAnchor="middle" className="sim-formula">-0.1986 kJ</text>
      <path d="M448 206l18 10-18 10" fill="none" stroke="var(--sim-accent)" strokeWidth="3" />
      <text x="352" y="334" textAnchor="middle" className="sim-label">{`only converted entropy enters ${DELTA}G`}</text>
    </svg>
  );
}

function FormationScene() {
  return (
    <svg viewBox="0 0 704 480" role="img" aria-label="Formation ledger simulation">
      <FormulaHeader label="formation ledger" />
      <line x1="352" y1="100" x2="352" y2="386" className="sim-thin-line" />
      {["CO2", "2H2O"].map((label, index) => (
        <g key={label} className={index === 1 ? "sim-wave" : ""}>
          <rect x="104" y={146 + index * 76} width="202" height="52" rx="8" fill="rgba(43,143,138,0.1)" stroke="var(--sim-accent)" />
          <text x="126" y={178 + index * 76} className="sim-formula">{label}</text>
        </g>
      ))}
      {["CH4", "2O2"].map((label, index) => (
        <g key={label}>
          <rect x="398" y={146 + index * 76} width="202" height="52" rx="8" fill="rgba(199,131,32,0.12)" stroke="var(--sim-warm)" />
          <text x="420" y={178 + index * 76} className="sim-formula">{label}</text>
        </g>
      ))}
      <path className="sim-stroke-hot sim-draw" d="M306 332 C326 356, 378 356, 398 332" />
      <text x="190" y="108" textAnchor="middle" className="sim-label">products sum</text>
      <text x="500" y="108" textAnchor="middle" className="sim-label">reactants sum</text>
      <text x="352" y="392" textAnchor="middle" className="sim-formula">products - reactants</text>
    </svg>
  );
}

function BondsScene() {
  return (
    <svg viewBox="0 0 704 480" role="img" aria-label="Bond strain map simulation">
      <Grid />
      <FormulaHeader label="bond strain" />
      <g className="sim-wave">
        <line x1="188" y1="194" x2="282" y2="194" className="sim-stroke-warm" />
        <circle cx="166" cy="194" r="18" fill="var(--sim-paper)" stroke="var(--sim-warm)" strokeWidth="3" />
        <circle cx="304" cy="194" r="18" fill="var(--sim-paper)" stroke="var(--sim-warm)" strokeWidth="3" />
      </g>
      <g>
        <line x1="426" y1="258" x2="520" y2="258" className="sim-stroke-accent" />
        <circle cx="404" cy="258" r="18" fill="var(--sim-paper)" stroke="var(--sim-accent)" strokeWidth="3" />
        <circle cx="542" cy="258" r="18" fill="var(--sim-paper)" stroke="var(--sim-accent)" strokeWidth="3" />
      </g>
      <path className="sim-stroke-hot sim-draw" d="M310 218 C350 180, 396 196, 430 238" />
      <text x="228" y="148" textAnchor="middle" className="sim-label">breaking absorbs</text>
      <text x="474" y="306" textAnchor="middle" className="sim-label">forming releases</text>
      <text x="352" y="394" textAnchor="middle" className="sim-formula">{`broken - formed = ${DELTA}H`}</text>
    </svg>
  );
}

function PhaseScene() {
  return (
    <svg viewBox="0 0 704 480" role="img" aria-label="Phase space field simulation">
      <Grid />
      <FormulaHeader label="phase field" />
      <path d="M116 364 C212 274, 286 246, 374 194 C456 146, 528 122, 614 100" fill="none" stroke="var(--sim-hot)" strokeWidth="2" strokeDasharray="8 9" />
      <path d="M116 364 C248 390, 414 320, 614 100 L614 404 L116 404z" fill="rgba(43,143,138,0.08)" />
      <path d="M116 364 C212 274, 286 246, 374 194 C456 146, 528 122, 614 100 L614 70 L116 70z" fill="rgba(184,92,106,0.08)" />
      <path className="sim-stroke-accent sim-draw" d="M162 324 C244 278, 302 286, 368 238 C424 198, 488 198, 550 158" />
      <g className="sim-scan">
        <circle cx="368" cy="238" r="13" className="sim-hot" />
      </g>
      <text x="158" y="388" className="sim-label">feasible region</text>
      <text x="472" y="118" className="sim-label">not feasible region</text>
      <text x="368" y="438" textAnchor="middle" className="sim-formula">{`reaction trajectory through ${DELTA}H / ${DELTA}S space`}</text>
    </svg>
  );
}

export function SimulationScene({ kind }: SimulationSceneProps) {
  if (kind === "balance") return <BalanceScene />;
  if (kind === "landscape") return <LandscapeScene />;
  if (kind === "entropy") return <EntropyScene />;
  if (kind === "coordinate") return <CoordinateScene />;
  if (kind === "vectors") return <VectorScene />;
  if (kind === "threshold") return <ThresholdScene />;
  if (kind === "orbit") return <OrbitScene />;
  if (kind === "stack") return <StackScene />;
  if (kind === "conversion") return <ConversionScene />;
  if (kind === "formation") return <FormationScene />;
  if (kind === "bonds") return <BondsScene />;
  return <PhaseScene />;
}
