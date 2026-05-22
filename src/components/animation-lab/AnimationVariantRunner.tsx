"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AnimationVariantId = "formation" | "bonds" | "entropy" | "gibbs";

export type AnimationVariantDefinition = {
  id: AnimationVariantId;
  title: string;
  testId: string;
  durationMs: number;
  concept: string;
  stages: string[];
};

type AnimationVariantRunnerProps = {
  variant: AnimationVariantDefinition;
};

type PlaybackState = "idle" | "playing" | "paused" | "ended";

type LedgerEntryProps = {
  x: number;
  y: number;
  width: number;
  label: string;
  value: string;
  reveal: number;
  accent: "good" | "cool" | "warm" | "hot";
};

type BondPairProps = {
  x: number;
  y: number;
  left: string;
  right: string;
  reveal: number;
  split?: number;
  formed?: number;
};

const DELTA = "\u0394";
const SIGMA = "\u03a3";
const MINUS = "\u2212";
const ARROW = "\u2192";

const ENTROPY_MICROSTATES = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 4],
  [1, 5],
  [2, 3],
  [2, 4],
  [2, 5],
  [3, 4],
  [3, 5],
  [4, 5],
] as const;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function smooth(amount: number) {
  const value = clamp(amount);
  return value * value * (3 - 2 * value);
}

function phase(progress: number, start: number, end: number) {
  return smooth((progress - start) / (end - start));
}

function containsSlot(slots: readonly number[], slot: number) {
  return slots.includes(slot);
}

function stageIndexFromProgress(progress: number, stageCount: number) {
  if (progress >= 1) {
    return stageCount - 1;
  }

  return Math.min(stageCount - 1, Math.floor(progress * stageCount));
}

function emitAuditEvent(
  name: "animation-audit:start" | "animation-audit:stage" | "animation-audit:end",
  variant: AnimationVariantDefinition,
  detail: {
    progress: number;
    stageIndex: number;
    playbackRate: number;
    reducedMotion: boolean;
  },
) {
  window.dispatchEvent(
    new CustomEvent(name, {
      detail: {
        variantId: variant.id,
        testId: variant.testId,
        title: variant.title,
        stage: variant.stages[detail.stageIndex],
        stageIndex: detail.stageIndex,
        progress: Number(detail.progress.toFixed(4)),
        playbackRate: detail.playbackRate,
        reducedMotion: detail.reducedMotion,
        timestamp: performance.now(),
      },
    }),
  );
}

function LedgerEntry({ x, y, width, label, value, reveal, accent }: LedgerEntryProps) {
  return (
    <g opacity={reveal}>
      <rect x={x} y={y} width={width} height="34" rx="9" className="audit-ledger-bg" />
      <rect
        x={x}
        y={y}
        width={Math.max(0, width * reveal)}
        height="34"
        rx="9"
        className={`audit-ledger-fill audit-ledger-fill-${accent}`}
      />
      <text x={x + 12} y={y + 22} className="audit-scene-caption">
        {label}
      </text>
      <text x={x + width - 12} y={y + 22} textAnchor="end" className="audit-scene-label">
        {value}
      </text>
    </g>
  );
}

function BondPair({ x, y, left, right, reveal, split = 0, formed = 0 }: BondPairProps) {
  const leftX = lerp(x - 22, x - 44, split) + lerp(0, 18, formed);
  const rightX = lerp(x + 22, x + 44, split) - lerp(0, 18, formed);
  const bondOpacity = clamp(reveal * (1 - split * 0.82) + formed * 0.82);

  return (
    <g opacity={reveal}>
      <line x1={leftX + 18} y1={y} x2={rightX - 18} y2={y} className="audit-bond-line" opacity={bondOpacity} />
      <circle cx={leftX} cy={y} r="19" className="audit-atom" />
      <circle cx={rightX} cy={y} r="19" className="audit-atom" />
      <text x={leftX} y={y + 5} textAnchor="middle" className="audit-atom-label">
        {left}
      </text>
      <text x={rightX} y={y + 5} textAnchor="middle" className="audit-atom-label">
        {right}
      </text>
    </g>
  );
}

function GibbsAuditScene({ progress }: { progress: number }) {
  const formula = phase(progress, 0, 0.15);
  const enthalpy = phase(progress, 0.12, 0.32);
  const temperature = phase(progress, 0.3, 0.52);
  const subtract = phase(progress, 0.5, 0.74);
  const sign = phase(progress, 0.7, 0.9);
  const conclusion = phase(progress, 0.82, 1);
  const entropyWidth = lerp(34, 164, temperature);
  const markerX = lerp(360, 226, sign);

  return (
    <svg viewBox="0 0 760 360" role="img" aria-label="Gibbs free energy equation audit animation">
      <text x="380" y="38" textAnchor="middle" className="audit-scene-title" opacity={formula}>
        {`${DELTA}G = ${DELTA}H ${MINUS} T${DELTA}S`}
      </text>

      <g opacity={enthalpy}>
        <text x="172" y="82" textAnchor="middle" className="audit-scene-label">
          measured enthalpy
        </text>
        <rect x="82" y="102" width="180" height="42" rx="12" className="audit-value-box audit-value-good" />
        <rect x="82" y="102" width={lerp(0, 180, enthalpy)} height="42" rx="12" className="audit-value-fill-good" />
        <text x="172" y="129" textAnchor="middle" className="audit-scene-result">
          {`${DELTA}H = ${MINUS}42.0`}
        </text>
      </g>

      <text x="380" y="130" textAnchor="middle" className="audit-operation" opacity={subtract}>
        {MINUS}
      </text>

      <g opacity={phase(progress, 0.22, 0.58)}>
        <text x="586" y="82" textAnchor="middle" className="audit-scene-label">
          entropy term scales with T
        </text>
        <rect x="496" y="102" width="180" height="42" rx="12" className="audit-value-box audit-value-hot" />
        <rect x="496" y="102" width={entropyWidth} height="42" rx="12" className="audit-value-fill-hot" />
        <text x="586" y="129" textAnchor="middle" className="audit-scene-result" opacity={temperature}>
          {`T${DELTA}S = +35.8`}
        </text>
        <line x1="504" y1="174" x2="668" y2="174" className="audit-gauge" />
        <circle cx={lerp(504, 668, temperature)} cy="174" r="9" className="audit-fill-hot" />
        <text x="586" y="202" textAnchor="middle" className="audit-scene-caption">
          {`T: 0 K ${ARROW} 298 K`}
        </text>
      </g>

      <g opacity={subtract}>
        <path d="M262 123 C304 190, 340 210, 380 234" className="audit-line audit-line-good" />
        <path d="M496 123 C456 190, 420 210, 380 234" className="audit-line audit-line-hot" />
        <rect x="280" y="218" width="200" height="52" rx="14" className="audit-result-box" />
        <text x="380" y="251" textAnchor="middle" className="audit-scene-result">
          {`${DELTA}G = ${MINUS}77.8 kJ mol^-1`}
        </text>
      </g>

      <g opacity={phase(progress, 0.64, 1)}>
        <line x1="150" y1="312" x2="610" y2="312" className="audit-gauge" />
        <line x1="380" y1="300" x2="380" y2="324" className="audit-gauge-zero" />
        <rect x="150" y="304" width={lerp(0, 230, sign)} height="16" rx="8" className="audit-value-fill-good" />
        <circle cx={markerX} cy="312" r="11" className="audit-fill-good" opacity={sign} />
        <text x="150" y="342" className="audit-scene-caption">
          negative: spontaneous
        </text>
        <text x="454" y="342" className="audit-scene-caption">
          positive: non-spontaneous
        </text>
        <text x="380" y="298" textAnchor="middle" className="audit-scene-label" opacity={conclusion}>
          sign check
        </text>
      </g>
    </svg>
  );
}

function EntropyAuditScene({ progress }: { progress: number }) {
  const intro = phase(progress, 0, 0.16);
  const unlock = phase(progress, 0.18, 0.42);
  const states = phase(progress, 0.38, 0.68);
  const compare = phase(progress, 0.62, 0.84);
  const result = phase(progress, 0.8, 1);
  const unlockedSlots = Math.round(lerp(2, 6, unlock));

  return (
    <svg viewBox="0 0 760 360" role="img" aria-label="Entropy accessible arrangements audit animation">
      <text x="380" y="38" textAnchor="middle" className="audit-scene-title" opacity={intro}>
        {`${DELTA}S follows the number of accessible arrangements`}
      </text>

      <g opacity={intro}>
        <rect x="58" y="76" width="270" height="148" rx="18" className="audit-panel" />
        <text x="193" y="104" textAnchor="middle" className="audit-scene-label">
          constrained initial state
        </text>
        {[0, 1, 2, 3, 4, 5].map((slot) => {
          const unlocked = slot < 2;
          return (
            <g key={slot}>
              <rect
                x={98 + slot * 35}
                y="132"
                width="25"
                height="42"
                rx="7"
                className={unlocked ? "audit-state-slot-active" : "audit-state-slot-locked"}
              />
              {unlocked ? <circle cx={110.5 + slot * 35} cy="153" r="6" className="audit-fill-good" /> : null}
            </g>
          );
        })}
        <text x="193" y="204" textAnchor="middle" className="audit-scene-result">
          W_initial = 3
        </text>
      </g>

      <g opacity={phase(progress, 0.16, 0.56)}>
        <rect x="432" y="76" width="270" height="148" rx="18" className="audit-panel" />
        <text x="567" y="104" textAnchor="middle" className="audit-scene-label">
          constraint removed
        </text>
        {[0, 1, 2, 3, 4, 5].map((slot) => {
          const active = slot < unlockedSlots;
          return (
            <g key={slot}>
              <rect
                x={472 + slot * 35}
                y="132"
                width="25"
                height="42"
                rx="7"
                className={active ? "audit-state-slot-active" : "audit-state-slot-locked"}
                opacity={active ? 1 : 0.45}
              />
              {active ? <circle cx={484.5 + slot * 35} cy="153" r="6" className="audit-fill-cool" /> : null}
            </g>
          );
        })}
        <text x="567" y="204" textAnchor="middle" className="audit-scene-result" opacity={compare}>
          W_final = 15
        </text>
      </g>

      <g opacity={states}>
        <text x="380" y="252" textAnchor="middle" className="audit-scene-label">
          accessible arrangements counted, not random drift
        </text>
        {ENTROPY_MICROSTATES.map((occupiedSlots, row) => (
          <g key={occupiedSlots.join("-")} opacity={phase(progress, 0.36 + row * 0.012, 0.5 + row * 0.012)}>
            {[0, 1, 2, 3, 4, 5].map((slot) => (
              <rect
                key={slot}
                x={170 + slot * 30 + (row % 6) * 64}
                y={274 + Math.floor(row / 6) * 30}
                width="18"
                height="18"
                rx="5"
                className={containsSlot(occupiedSlots, slot) ? "audit-microstate-on" : "audit-microstate-off"}
              />
            ))}
          </g>
        ))}
      </g>

      <g opacity={compare}>
        <path d="M320 150 C356 130, 404 130, 440 150" className="audit-line audit-line-cool" />
        <path d="M426 139 L444 150 L426 161" className="audit-arrow-good" />
        <text x="380" y="118" textAnchor="middle" className="audit-scene-caption">
          more locations allow more arrangements
        </text>
      </g>

      <text x="380" y="342" textAnchor="middle" className="audit-scene-result" opacity={result}>
        {`${DELTA}S = R ln(W_final / W_initial) > 0`}
      </text>
    </svg>
  );
}

function FormationAuditScene({ progress }: { progress: number }) {
  const equation = phase(progress, 0, 0.14);
  const products = phase(progress, 0.14, 0.4);
  const reactants = phase(progress, 0.34, 0.58);
  const subtotals = phase(progress, 0.54, 0.78);
  const result = phase(progress, 0.74, 1);

  return (
    <svg viewBox="0 0 760 360" role="img" aria-label="Formation enthalpy ledger audit animation">
      <text x="380" y="36" textAnchor="middle" className="audit-scene-title" opacity={equation}>
        {`CH4 + 2O2 ${ARROW} CO2 + 2H2O`}
      </text>
      <text x="380" y="64" textAnchor="middle" className="audit-scene-caption" opacity={equation}>
        {`${DELTA}H = ${SIGMA}n${DELTA}Hf products ${MINUS} ${SIGMA}n${DELTA}Hf reactants`}
      </text>

      <g opacity={phase(progress, 0.1, 1)}>
        <rect x="50" y="88" width="315" height="206" rx="18" className="audit-panel" />
        <rect x="395" y="88" width="315" height="206" rx="18" className="audit-panel" />
        <text x="207" y="118" textAnchor="middle" className="audit-scene-label">
          products
        </text>
        <text x="552" y="118" textAnchor="middle" className="audit-scene-label">
          reactants
        </text>
      </g>

      <LedgerEntry
        x={78}
        y={138}
        width={258}
        label={`1 x CO2: 1 x ${MINUS}393.5`}
        value={`${MINUS}393.5`}
        reveal={products}
        accent="good"
      />
      <LedgerEntry
        x={78}
        y={182}
        width={258}
        label={`2 x H2O: 2 x ${MINUS}285.8`}
        value={`${MINUS}571.6`}
        reveal={phase(progress, 0.24, 0.48)}
        accent="good"
      />
      <LedgerEntry
        x={423}
        y={138}
        width={258}
        label={`1 x CH4: 1 x ${MINUS}74.8`}
        value={`${MINUS}74.8`}
        reveal={reactants}
        accent="cool"
      />
      <LedgerEntry
        x={423}
        y={182}
        width={258}
        label="2 x O2: 2 x 0"
        value="0.0"
        reveal={phase(progress, 0.42, 0.62)}
        accent="cool"
      />

      <g opacity={subtotals}>
        <line x1="78" y1="246" x2="336" y2="246" className="audit-gauge" />
        <line x1="423" y1="246" x2="681" y2="246" className="audit-gauge" />
        <text x="207" y="272" textAnchor="middle" className="audit-scene-result">
          {`${SIGMA} products = ${MINUS}965.1`}
        </text>
        <text x="552" y="272" textAnchor="middle" className="audit-scene-result">
          {`${SIGMA} reactants = ${MINUS}74.8`}
        </text>
      </g>

      <g opacity={result}>
        <path d="M336 308 C392 335, 460 335, 516 308" className="audit-line audit-line-hot" />
        <path d="M500 298 L520 308 L501 320" className="audit-arrow-hot" />
        <rect x="230" y="300" width="300" height="42" rx="14" className="audit-result-box" />
        <text x="380" y="327" textAnchor="middle" className="audit-scene-result">
          {`${DELTA}H = ${MINUS}965.1 ${MINUS} (${MINUS}74.8) = ${MINUS}890.3`}
        </text>
      </g>
    </svg>
  );
}

function BondAuditScene({ progress }: { progress: number }) {
  const intro = phase(progress, 0, 0.16);
  const breaking = phase(progress, 0.14, 0.42);
  const brokenTotal = phase(progress, 0.34, 0.55);
  const forming = phase(progress, 0.48, 0.72);
  const result = phase(progress, 0.7, 1);

  return (
    <svg viewBox="0 0 760 360" role="img" aria-label="Bond enthalpy accounting audit animation">
      <text x="380" y="36" textAnchor="middle" className="audit-scene-title" opacity={intro}>
        {`H2 + Cl2 ${ARROW} 2HCl`}
      </text>
      <text x="380" y="64" textAnchor="middle" className="audit-scene-caption" opacity={intro}>
        {`${DELTA}H = bonds broken ${MINUS} bonds formed`}
      </text>

      <g opacity={phase(progress, 0.08, 1)}>
        <rect x="50" y="88" width="315" height="214" rx="18" className="audit-panel" />
        <rect x="395" y="88" width="315" height="214" rx="18" className="audit-panel" />
        <text x="207" y="118" textAnchor="middle" className="audit-scene-label">
          break bonds: energy in
        </text>
        <text x="552" y="118" textAnchor="middle" className="audit-scene-label">
          form bonds: energy released
        </text>
      </g>

      <BondPair x={145} y={156} left="H" right="H" reveal={breaking} split={breaking} />
      <BondPair x={270} y={156} left="Cl" right="Cl" reveal={phase(progress, 0.2, 0.48)} split={phase(progress, 0.2, 0.48)} />

      <g opacity={breaking}>
        <path d="M145 224 L145 186" className="audit-arrow-warm" />
        <path d="M136 196 L145 184 L154 196" className="audit-arrow-warm" />
        <path d="M270 224 L270 186" className="audit-arrow-warm" />
        <path d="M261 196 L270 184 L279 196" className="audit-arrow-warm" />
      </g>
      <LedgerEntry
        x={84}
        y={246}
        width={246}
        label="H-H 436 + Cl-Cl 242"
        value="+678"
        reveal={brokenTotal}
        accent="warm"
      />

      <BondPair x={490} y={156} left="H" right="Cl" reveal={forming} formed={forming} />
      <BondPair x={616} y={156} left="H" right="Cl" reveal={phase(progress, 0.56, 0.78)} formed={phase(progress, 0.56, 0.78)} />
      <g opacity={forming}>
        <path d="M490 186 L490 224" className="audit-arrow-good" />
        <path d="M481 214 L490 226 L499 214" className="audit-arrow-good" />
        <path d="M616 186 L616 224" className="audit-arrow-good" />
        <path d="M607 214 L616 226 L625 214" className="audit-arrow-good" />
      </g>
      <LedgerEntry
        x={429}
        y={246}
        width={246}
        label="2 x H-Cl 431"
        value={`${MINUS}862`}
        reveal={phase(progress, 0.62, 0.82)}
        accent="good"
      />

      <g opacity={result}>
        <rect x="232" y="306" width="296" height="40" rx="14" className="audit-result-box" />
        <text x="380" y="331" textAnchor="middle" className="audit-scene-result">
          {`${DELTA}H = +678 ${MINUS} 862 = ${MINUS}184 kJ mol^-1`}
        </text>
      </g>
    </svg>
  );
}

function AuditScene({ id, progress }: { id: AnimationVariantId; progress: number }) {
  if (id === "gibbs") return <GibbsAuditScene progress={progress} />;
  if (id === "entropy") return <EntropyAuditScene progress={progress} />;
  if (id === "formation") return <FormationAuditScene progress={progress} />;
  return <BondAuditScene progress={progress} />;
}

export function AnimationVariantRunner({ variant }: AnimationVariantRunnerProps) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const stageRef = useRef(0);
  const stateRef = useRef<PlaybackState>("idle");
  const rateRef = useRef(1);
  const reducedRef = useRef(false);
  const tickRef = useRef<(timestamp: number) => void>(() => undefined);
  const lastProgressPaintRef = useRef(0);

  const activeDuration = reducedMotion ? Math.min(900, variant.durationMs * 0.28) : variant.durationMs;
  const visualProgress = reducedMotion ? 1 : progress;
  const currentStageIndex = stageIndexFromProgress(progress, variant.stages.length);

  const cancelFrame = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    tickRef.current = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const duration = reducedRef.current ? Math.min(900, variant.durationMs * 0.28) : variant.durationMs;
      const elapsed = elapsedRef.current + (timestamp - startTimeRef.current) * rateRef.current;
      const nextProgress = clamp(elapsed / duration);
      const nextStage = stageIndexFromProgress(nextProgress, variant.stages.length);
      const stageChanged = nextStage !== stageRef.current;

      if (stageChanged) {
        stageRef.current = nextStage;
        emitAuditEvent("animation-audit:stage", variant, {
          progress: nextProgress,
          stageIndex: nextStage,
          playbackRate: rateRef.current,
          reducedMotion: reducedRef.current,
        });
      }

      if (timestamp - lastProgressPaintRef.current > 32 || nextProgress >= 1 || stageChanged) {
        setProgress(nextProgress);
        lastProgressPaintRef.current = timestamp;
      }

      if (nextProgress >= 1) {
        stateRef.current = "ended";
        setPlaybackState("ended");
        elapsedRef.current = duration;
        startTimeRef.current = null;
        rafRef.current = null;
        emitAuditEvent("animation-audit:end", variant, {
          progress: 1,
          stageIndex: variant.stages.length - 1,
          playbackRate: rateRef.current,
          reducedMotion: reducedRef.current,
        });
        return;
      }

      rafRef.current = window.requestAnimationFrame(tickRef.current);
    };
  }, [variant]);

  const startRun = useCallback(
    (fromBeginning: boolean) => {
      cancelFrame();
      const baseProgress = fromBeginning ? 0 : progress;
      const duration = reducedRef.current ? Math.min(900, variant.durationMs * 0.28) : variant.durationMs;
      const startStage = stageIndexFromProgress(baseProgress, variant.stages.length);

      elapsedRef.current = fromBeginning ? 0 : baseProgress * duration;
      startTimeRef.current = null;
      stageRef.current = startStage;
      lastProgressPaintRef.current = 0;
      stateRef.current = "playing";
      setPlaybackState("playing");
      setProgress(baseProgress);

      emitAuditEvent("animation-audit:start", variant, {
        progress: baseProgress,
        stageIndex: startStage,
        playbackRate: rateRef.current,
        reducedMotion: reducedRef.current,
      });
      emitAuditEvent("animation-audit:stage", variant, {
        progress: baseProgress,
        stageIndex: startStage,
        playbackRate: rateRef.current,
        reducedMotion: reducedRef.current,
      });

      rafRef.current = window.requestAnimationFrame(tickRef.current);
    },
    [cancelFrame, progress, variant],
  );

  function syncElapsedBeforeControlChange() {
    if (stateRef.current !== "playing" || startTimeRef.current === null) {
      return;
    }

    elapsedRef.current += (performance.now() - startTimeRef.current) * rateRef.current;
    startTimeRef.current = performance.now();
  }

  function handlePlayOnce() {
    if (stateRef.current === "paused") {
      startRun(false);
      return;
    }

    if (stateRef.current !== "playing") {
      startRun(true);
    }
  }

  function handleReplay() {
    startRun(true);
  }

  function handlePause() {
    if (stateRef.current !== "playing") {
      return;
    }

    syncElapsedBeforeControlChange();
    cancelFrame();
    stateRef.current = "paused";
    setPlaybackState("paused");
  }

  function handleSlowMotion() {
    syncElapsedBeforeControlChange();
    const nextRate = rateRef.current === 1 ? 0.5 : 1;
    rateRef.current = nextRate;
    setPlaybackRate(nextRate);
  }

  function handleReducedMotion() {
    syncElapsedBeforeControlChange();
    const nextReduced = !reducedRef.current;
    reducedRef.current = nextReduced;
    setReducedMotion(nextReduced);
    if (nextReduced && stateRef.current !== "playing") {
      setProgress(1);
      elapsedRef.current = Math.min(900, variant.durationMs * 0.28);
      stateRef.current = "ended";
      setPlaybackState("ended");
    }
  }

  useEffect(() => {
    return () => cancelFrame();
  }, [cancelFrame]);

  useEffect(() => {
    sectionRef.current?.setAttribute("data-audit-ready", "true");
  }, []);

  return (
    <section
      ref={sectionRef}
      className="animation-variant-runner"
      data-testid={variant.testId}
      data-animation-variant={variant.id}
      data-playback-state={playbackState}
      data-motion-mode={reducedMotion ? "reduced" : "full"}
      data-audit-ready="false"
    >
      <div className="animation-runner-copy">
        <p className="animation-runner-kicker">Finite sequence</p>
        <h2>{variant.title}</h2>
        <p>{variant.concept}</p>
        <ol>
          {variant.stages.map((stage, index) => (
            <li
              key={stage}
              className={index === currentStageIndex ? "is-current" : undefined}
            >
              {stage}
            </li>
          ))}
        </ol>
      </div>

      <div className="animation-runner-stage">
        <div className="animation-runner-controls" aria-label={`${variant.title} animation controls`}>
          <button type="button" onClick={handlePlayOnce} data-testid={`animation-control-${variant.id}-play`}>
            Play once
          </button>
          <button type="button" onClick={handleReplay} data-testid={`animation-control-${variant.id}-replay`}>
            Replay
          </button>
          <button
            type="button"
            onClick={handlePause}
            disabled={playbackState !== "playing"}
            data-testid={`animation-control-${variant.id}-pause`}
          >
            Pause
          </button>
          <button
            type="button"
            onClick={handleSlowMotion}
            aria-pressed={playbackRate === 0.5}
            data-testid={`animation-control-${variant.id}-slow`}
          >
            Slow motion 0.5x
          </button>
          <button
            type="button"
            onClick={handleReducedMotion}
            aria-pressed={reducedMotion}
            data-testid={`animation-control-${variant.id}-reduced`}
          >
            Reduced motion preview
          </button>
        </div>

        <div className="animation-runner-canvas">
          <AuditScene id={variant.id} progress={visualProgress} />
        </div>

        <div className="animation-runner-meter" aria-label={`${variant.title} progress`}>
          <span style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        <div className="animation-runner-status">
          <span>{playbackState}</span>
          <span>{playbackRate === 0.5 ? "0.5x" : "1x"}</span>
          <span>{reducedMotion ? "reduced motion" : `${Math.round(activeDuration)} ms`}</span>
        </div>
      </div>
    </section>
  );
}
