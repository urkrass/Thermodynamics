import { expect, test, type Browser, type Page } from "@playwright/test";
import { spawn, type ChildProcess } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

type AnimationVariantId = "gibbs" | "entropy" | "formation" | "bonds";

type AuditVariant = {
  id: AnimationVariantId;
  testId: string;
  label: string;
  expectedStages: number;
  forcedRecommendation?: "keep" | "redesign" | "delete";
  rubric: Omit<RubricScores, "smoothness">;
  review: {
    triesToTeach: string;
    visualSequence: string;
    scientificMeaning: string;
    pacing: string;
    taste: string;
    exactChangesNeeded: string[];
  };
};

type AuditEventDetail = {
  variantId: AnimationVariantId;
  testId: string;
  title: string;
  stage: string;
  stageIndex: number;
  progress: number;
  playbackRate: number;
  reducedMotion: boolean;
  timestamp: number;
};

type FrameMetrics = {
  variantId: string;
  frameCount: number;
  sampledDurationMs: number;
  frameDeltas: number[];
  framesOver16: number;
  framesOver33: number;
  framesOver50: number;
  framesOver33Ratio: number;
  droppedFrameRatio: number;
  maxFrameMs: number;
  averageFps: number;
  minFpsRolling: number;
  longAnimationFrame: {
    supported: boolean;
    count: number;
    worstDurationMs: number;
  };
  events: AuditEventDetail[];
};

type RubricScores = {
  smoothness: number;
  visualClarity: number;
  scientificMeaning: number;
  timingAndPacing: number;
  lessonIntegration: number;
  lackOfVisualNoise: number;
  ibSuitability: number;
};

type VariantAuditResult = {
  variant: AuditVariant;
  metrics: FrameMetrics & {
    layoutShiftPx: number;
    reducedMotionPreviewPassed: boolean;
    videoPath: string;
    tracePath: string;
    metricsPath: string;
  };
  scores: RubricScores;
  recommendation: "keep" | "redesign" | "delete";
  passed: boolean;
  failures: string[];
};

type AuditWindow = Window & {
  __animationAuditEvents?: AuditEventDetail[];
  __animationAuditLastEnd?: AuditEventDetail | null;
  __animationAuditStartSampler?: (variantId: string) => void;
  __animationAuditStopSampler?: () => FrameMetrics;
};

const repoRoot = path.resolve(__dirname, "..");
const auditRoot = path.resolve(
  repoRoot,
  process.env.ANIMATION_AUDIT_OUTPUT_ROOT ?? path.join("design-research", "animation-audit"),
);
const videosDir = path.join(auditRoot, "videos");
const tracesDir = path.join(auditRoot, "traces");
const metricsDir = path.join(auditRoot, "metrics");
const auditReportPath = path.join(auditRoot, "audit.md");
const serverLogPath = path.join(auditRoot, "server.log");
const auditUrl = process.env.ANIMATION_AUDIT_BASE_URL ?? "http://127.0.0.1:3107/animation-lab";
const auditOrigin = new URL(auditUrl).origin;

const variants: AuditVariant[] = [
  {
    id: "gibbs",
    testId: "animation-variant-gibbs",
    label: "Gibbs free energy",
    expectedStages: 5,
    rubric: {
      visualClarity: 4,
      scientificMeaning: 5,
      timingAndPacing: 4,
      lessonIntegration: 5,
      lackOfVisualNoise: 4,
      ibSuitability: 5,
    },
    review: {
      triesToTeach: "Whether Delta H, T Delta S, and Delta G make a process spontaneous.",
      visualSequence:
        "The equation appears, Delta H is fixed, temperature scales T Delta S, the subtraction converges into Delta G, and the sign is checked on a spontaneous/non-spontaneous rail.",
      scientificMeaning:
        "Meaningful enough to keep refining. The animation now makes temperature scaling and the final sign part of the equation rather than a separate decoration.",
      pacing:
        "The beats are slower and closer to the algebraic sequence; the result does not appear before the terms are introduced.",
      taste:
        "Restrained and diagrammatic. It feels closer to a science explanation than a generic UI metaphor.",
      exactChangesNeeded: [
        "Refine numeric typography so units and signs remain readable at worksheet scale.",
        "Consider adding a second temperature state later to show sign reversal.",
        "Keep the motion tied to the equation; do not reintroduce a balance metaphor unless it carries the arithmetic.",
      ],
    },
  },
  {
    id: "entropy",
    testId: "animation-variant-entropy",
    label: "Entropy",
    expectedStages: 5,
    rubric: {
      visualClarity: 4,
      scientificMeaning: 4,
      timingAndPacing: 4,
      lessonIntegration: 5,
      lackOfVisualNoise: 5,
      ibSuitability: 5,
    },
    review: {
      triesToTeach: "Entropy as the increase in accessible arrangements and dispersal of energy.",
      visualSequence:
        "A constrained state with two accessible locations becomes an unlocked state with more locations; microstate rows reveal the larger count before Delta S is concluded.",
      scientificMeaning:
        "Substantially better. It no longer depends on random dot dispersal and instead compares W_initial with W_final.",
      pacing:
        "Suitable for students: the unlock, count, compare, and formula steps are separate enough to follow.",
      taste:
        "Clean, quiet, and mathematical. It is still simple, but it is no longer decorative filler.",
      exactChangesNeeded: [
        "Keep the state-count idea, but make the microstate grid even more legible if it enters production.",
        "Add a short text coupling to the lesson paragraph so students know W means accessible arrangements.",
        "Avoid adding drifting particles back into this scene.",
      ],
    },
  },
  {
    id: "formation",
    testId: "animation-variant-formation",
    label: "Formation enthalpy",
    expectedStages: 5,
    rubric: {
      visualClarity: 4,
      scientificMeaning: 5,
      timingAndPacing: 4,
      lessonIntegration: 5,
      lackOfVisualNoise: 4,
      ibSuitability: 5,
    },
    review: {
      triesToTeach: "Formation enthalpy as product formation values minus reactant formation values.",
      visualSequence:
        "The balanced combustion equation appears, coefficient-times-formation-value rows reveal, subtotals are built, then products minus reactants resolves Delta H.",
      scientificMeaning:
        "Meaningful and worksheet-aligned. The motion now corresponds to the exact calculation students perform.",
      pacing:
        "Paced as a calculation sequence rather than a static table.",
      taste:
        "Still ledger-like, but intentionally so; it reads as refined chemistry accounting rather than a dashboard.",
      exactChangesNeeded: [
        "Tune row density for the production side visual so it stays readable in the smaller worksheet column.",
        "Consider highlighting standard-state zero values only when the lesson text introduces them.",
        "Keep coefficients visible; hiding them would collapse the point of the scene.",
      ],
    },
  },
  {
    id: "bonds",
    testId: "animation-variant-bonds",
    label: "Bond enthalpy",
    expectedStages: 5,
    rubric: {
      visualClarity: 4,
      scientificMeaning: 5,
      timingAndPacing: 4,
      lessonIntegration: 5,
      lackOfVisualNoise: 4,
      ibSuitability: 5,
    },
    review: {
      triesToTeach: "Bond enthalpy as energy required to break bonds minus energy released when bonds form.",
      visualSequence:
        "H-H and Cl-Cl bonds split under upward energy arrows, H-Cl bonds form under downward release arrows, then the +678 and -862 ledgers resolve to -184.",
      scientificMeaning:
        "Meaningful enough to keep. The animation now separates energy input and energy released and uses real bond-energy subtotals.",
      pacing:
        "The staged lanes make the calculation narrative much clearer than the previous molecule wiggle.",
      taste:
        "More disciplined and diagrammatic. The molecule movement is minimal and tied to the bond operation.",
      exactChangesNeeded: [
        "If it moves into production, use the actual reaction from the active worksheet step.",
        "Keep the energy arrows and ledgers visually dominant over molecule motion.",
        "Add a compact legend for broken versus formed if students find the lane labels insufficient.",
      ],
    },
  },
];

const removedVariants = [
  {
    id: "particles",
    label: "Intro/default particles",
    round1: "delete",
    round2: "removed from active animation lab",
    reason:
      "The scene was smooth but generic. It did not teach a measurable thermodynamics operation, so round 2 removes it instead of polishing it.",
  },
] as const;

let spawnedServer: ChildProcess | undefined;

test.describe.configure({ mode: "serial" });
test.setTimeout(240_000);

test.beforeAll(async ({}, testInfo) => {
  testInfo.setTimeout(60_000);
  await prepareOutputDirs();
  await ensureServer();
});

test.afterAll(async () => {
  if (spawnedServer) {
    spawnedServer.kill();
  }
});

test("records finite animation runs, traces, metrics, and ranked audit", async ({
  browser,
}) => {
  const results: VariantAuditResult[] = [];

  for (const variant of variants) {
    results.push(await auditVariant(browser, variant));
  }

  await writeFile(auditReportPath, renderAuditReport(results), "utf8");

  const failures = results.flatMap((result) =>
    result.failures.map((failure) => `${result.variant.id}: ${failure}`),
  );
  expect(failures).toEqual([]);
});

async function prepareOutputDirs() {
  await mkdir(auditRoot, { recursive: true });
  await rm(videosDir, { recursive: true, force: true });
  await rm(tracesDir, { recursive: true, force: true });
  await rm(metricsDir, { recursive: true, force: true });
  await mkdir(videosDir, { recursive: true });
  await mkdir(tracesDir, { recursive: true });
  await mkdir(metricsDir, { recursive: true });
}

async function ensureServer() {
  if (await isServerReady()) {
    return;
  }

  const url = new URL(auditUrl);
  const port = url.port || "3107";
  const logStream = createWriteStream(serverLogPath, { flags: "w" });
  spawnedServer = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      port,
    ],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  spawnedServer.stdout?.pipe(logStream);
  spawnedServer.stderr?.pipe(logStream);

  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    if (await isServerReady()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  throw new Error(`Animation lab server did not become ready at ${auditOrigin}.`);
}

async function isServerReady() {
  try {
    const response = await fetch(auditUrl, { signal: AbortSignal.timeout(2500) });
    return response.ok;
  } catch {
    return false;
  }
}

async function auditVariant(browser: Browser, variant: AuditVariant) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
    recordVideo: {
      dir: videosDir,
      size: { width: 1440, height: 1000 },
    },
  });
  const page = await context.newPage();
  const videoPath = path.join(videosDir, `${variant.id}.webm`);
  const tracePath = path.join(tracesDir, `${variant.id}.zip`);
  const metricsPath = path.join(metricsDir, `${variant.id}.json`);

  try {
    await context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("Tracing has been already started")) {
      throw error;
    }
  }

  await page.goto(auditUrl, { waitUntil: "networkidle" });
  await hideDevOverlays(page);
  await installEventCollector(page);
  await installFrameSampler(page);

  const variantLocator = page.getByTestId(variant.testId);
  await variantLocator.scrollIntoViewIfNeeded();
  await expect(variantLocator).toBeVisible();
  await expect(variantLocator).toHaveAttribute("data-audit-ready", "true");
  const boxBefore = await variantLocator.boundingBox();
  if (!boxBefore) {
    throw new Error(`No bounding box for ${variant.id} before playback.`);
  }

  await armAnimationEndWaiter(page, variant.id);
  await page.getByTestId(`animation-control-${variant.id}-play`).click();
  await waitForAnimationEnd(page, variant.id);

  const frameMetrics = await page.evaluate(() => {
    const auditWindow = window as AuditWindow;
    if (!auditWindow.__animationAuditStopSampler) {
      throw new Error("Animation sampler was not installed.");
    }
    return auditWindow.__animationAuditStopSampler();
  });

  const boxAfter = await variantLocator.boundingBox();
  if (!boxAfter) {
    throw new Error(`No bounding box for ${variant.id} after playback.`);
  }
  const layoutShiftPx = maxBoxDelta(boxBefore, boxAfter);

  await page.getByTestId(`animation-control-${variant.id}-reduced`).click();
  await expect(variantLocator).toHaveAttribute("data-motion-mode", "reduced");
  const reducedMotionPreviewPassed =
    (await variantLocator.getAttribute("data-playback-state")) === "ended";

  await context.tracing.stop({ path: tracePath });
  const video = page.video();
  await page.close();
  if (video) {
    await video.saveAs(videoPath);
    await rm(await video.path(), { force: true });
  }
  await context.close();

  const scores = scoreVariant(variant, frameMetrics);
  const failures = collectFailures({
    frameMetrics,
    layoutShiftPx,
    reducedMotionPreviewPassed,
    expectedStages: variant.expectedStages,
  });
  const recommendation = recommendVariant(variant, scores, failures);
  const result: VariantAuditResult = {
    variant,
    metrics: {
      ...frameMetrics,
      layoutShiftPx,
      reducedMotionPreviewPassed,
      videoPath: relativePath(videoPath),
      tracePath: relativePath(tracePath),
      metricsPath: relativePath(metricsPath),
    },
    scores,
    recommendation,
    passed: failures.length === 0,
    failures,
  };

  await writeFile(metricsPath, `${JSON.stringify(result.metrics, null, 2)}\n`, "utf8");
  return result;
}

async function hideDevOverlays(page: Page) {
  await page.addStyleTag({
    content: `
      nextjs-portal,
      [data-nextjs-dev-overlay],
      [data-nextjs-dev-indicator],
      [data-nextjs-toast],
      .nextjs-dev-indicator,
      .nextjs-toast {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `,
  });
}

async function installEventCollector(page: Page) {
  await page.evaluate(() => {
    const auditWindow = window as AuditWindow;
    auditWindow.__animationAuditEvents = [];
    const collectEvent = (event: Event) => {
      const customEvent = event as CustomEvent<AuditEventDetail>;
      auditWindow.__animationAuditEvents?.push(customEvent.detail);
    };

    window.addEventListener("animation-audit:start", collectEvent);
    window.addEventListener("animation-audit:stage", collectEvent);
    window.addEventListener("animation-audit:end", collectEvent);
  });
}

async function installFrameSampler(page: Page) {
  await page.evaluate(() => {
    type SamplerState = {
      variantId: string;
      rafId: number | null;
      timestamps: number[];
      observer?: PerformanceObserver;
      longFrameSupported: boolean;
      longFrameDurations: number[];
    };

    const auditWindow = window as AuditWindow & {
      __animationAuditSamplerState?: SamplerState;
    };

    auditWindow.__animationAuditStartSampler = (variantId: string) => {
      const longFrameSupported =
        "PerformanceObserver" in window &&
        Array.isArray(PerformanceObserver.supportedEntryTypes) &&
        PerformanceObserver.supportedEntryTypes.includes("long-animation-frame");
      const state: SamplerState = {
        variantId,
        rafId: null,
        timestamps: [],
        longFrameSupported,
        longFrameDurations: [],
      };

      if (longFrameSupported) {
        try {
          state.observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              state.longFrameDurations.push(entry.duration);
            }
          });
          state.observer.observe({ type: "long-animation-frame", buffered: true });
        } catch {
          state.longFrameSupported = false;
        }
      }

      const sample = (timestamp: number) => {
        state.timestamps.push(timestamp);
        state.rafId = window.requestAnimationFrame(sample);
      };

      state.rafId = window.requestAnimationFrame(sample);
      auditWindow.__animationAuditSamplerState = state;
    };

    auditWindow.__animationAuditStopSampler = () => {
      const state = auditWindow.__animationAuditSamplerState;
      if (!state) {
        throw new Error("No active sampler state.");
      }

      if (state.rafId !== null) {
        window.cancelAnimationFrame(state.rafId);
      }
      state.observer?.disconnect();

      const frameDeltas = state.timestamps
        .slice(1)
        .map((timestamp, index) => timestamp - state.timestamps[index]);
      const sampledDurationMs =
        state.timestamps.length > 1
          ? state.timestamps[state.timestamps.length - 1] - state.timestamps[0]
          : 0;
      const averageDelta =
        frameDeltas.length > 0
          ? frameDeltas.reduce((sum, delta) => sum + delta, 0) / frameDeltas.length
          : 0;
      const averageFps = averageDelta > 0 ? 1000 / averageDelta : 0;
      const rollingFps = frameDeltas
        .map((_, index) => frameDeltas.slice(Math.max(0, index - 11), index + 1))
        .filter((windowDeltas) => windowDeltas.length >= 4)
        .map((windowDeltas) => 1000 / (windowDeltas.reduce((sum, delta) => sum + delta, 0) / windowDeltas.length));
      const framesOver16 = frameDeltas.filter((delta) => delta > 16.7).length;
      const framesOver33 = frameDeltas.filter((delta) => delta > 33.3).length;
      const framesOver50 = frameDeltas.filter((delta) => delta > 50).length;
      const worstLongFrame = state.longFrameDurations.length
        ? Math.max(...state.longFrameDurations)
        : 0;

      return {
        variantId: state.variantId,
        frameCount: state.timestamps.length,
        sampledDurationMs: Number(sampledDurationMs.toFixed(2)),
        frameDeltas: frameDeltas.map((delta) => Number(delta.toFixed(2))),
        framesOver16,
        framesOver33,
        framesOver50,
        framesOver33Ratio: frameDeltas.length ? Number((framesOver33 / frameDeltas.length).toFixed(4)) : 0,
        droppedFrameRatio: frameDeltas.length ? Number((framesOver33 / frameDeltas.length).toFixed(4)) : 0,
        maxFrameMs: frameDeltas.length ? Number(Math.max(...frameDeltas).toFixed(2)) : 0,
        averageFps: Number(averageFps.toFixed(2)),
        minFpsRolling: rollingFps.length ? Number(Math.min(...rollingFps).toFixed(2)) : Number(averageFps.toFixed(2)),
        longAnimationFrame: {
          supported: state.longFrameSupported,
          count: state.longFrameDurations.length,
          worstDurationMs: Number(worstLongFrame.toFixed(2)),
        },
        events: auditWindow.__animationAuditEvents ?? [],
      } satisfies FrameMetrics;
    };
  });
}

async function armAnimationEndWaiter(page: Page, variantId: AnimationVariantId) {
  await page.evaluate((id) => {
    const auditWindow = window as AuditWindow;
    auditWindow.__animationAuditLastEnd = null;
    const startHandler = (event: Event) => {
      const customEvent = event as CustomEvent<AuditEventDetail>;
      if (customEvent.detail.variantId === id) {
        auditWindow.__animationAuditStartSampler?.(id);
        window.removeEventListener("animation-audit:start", startHandler);
      }
    };
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<AuditEventDetail>;
      if (customEvent.detail.variantId === id) {
        auditWindow.__animationAuditLastEnd = customEvent.detail;
        window.removeEventListener("animation-audit:end", handler);
      }
    };

    window.addEventListener("animation-audit:start", startHandler);
    window.addEventListener("animation-audit:end", handler);
  }, variantId);
}

async function waitForAnimationEnd(page: Page, variantId: AnimationVariantId) {
  await page.waitForFunction(
    (id) => {
      const auditWindow = window as AuditWindow;
      return auditWindow.__animationAuditLastEnd?.variantId === id;
    },
    variantId,
    { timeout: 20_000 },
  );
}

function maxBoxDelta(
  before: NonNullable<Awaited<ReturnType<Page["locator"]>>["boundingBox"]> extends () => Promise<infer T>
    ? NonNullable<T>
    : never,
  after: NonNullable<Awaited<ReturnType<Page["locator"]>>["boundingBox"]> extends () => Promise<infer T>
    ? NonNullable<T>
    : never,
) {
  return Math.max(
    Math.abs(before.x - after.x),
    Math.abs(before.y - after.y),
    Math.abs(before.width - after.width),
    Math.abs(before.height - after.height),
  );
}

function scoreSmoothness(metrics: FrameMetrics) {
  if (metrics.averageFps >= 59 && metrics.framesOver33Ratio <= 0.02 && metrics.framesOver50 === 0) return 5;
  if (metrics.averageFps >= 55 && metrics.framesOver33Ratio <= 0.05 && metrics.framesOver50 <= 1) return 4;
  if (metrics.averageFps >= 48 && metrics.framesOver33Ratio <= 0.1) return 3;
  if (metrics.averageFps >= 40) return 2;
  return 1;
}

function scoreVariant(variant: AuditVariant, metrics: FrameMetrics): RubricScores {
  return {
    smoothness: scoreSmoothness(metrics),
    ...variant.rubric,
  };
}

function averageScore(scores: RubricScores) {
  const values = Object.values(scores);
  return values.reduce((sum, score) => sum + score, 0) / values.length;
}

function collectFailures({
  frameMetrics,
  layoutShiftPx,
  reducedMotionPreviewPassed,
  expectedStages,
}: {
  frameMetrics: FrameMetrics;
  layoutShiftPx: number;
  reducedMotionPreviewPassed: boolean;
  expectedStages: number;
}) {
  const failures: string[] = [];
  const eventStages = new Set(
    frameMetrics.events
      .filter((event) => event.variantId === frameMetrics.variantId && event.stageIndex >= 0)
      .map((event) => event.stageIndex),
  );

  if (frameMetrics.averageFps < 55) {
    failures.push(`average FPS ${frameMetrics.averageFps} is below 55`);
  }
  if (frameMetrics.framesOver33Ratio > 0.05) {
    failures.push(`${(frameMetrics.framesOver33Ratio * 100).toFixed(1)}% frames exceeded 33.3 ms`);
  }
  if (frameMetrics.framesOver50 > 2) {
    failures.push(`${frameMetrics.framesOver50} frames exceeded 50 ms`);
  }
  if (layoutShiftPx > 2) {
    failures.push(`layout shifted by ${layoutShiftPx.toFixed(2)} px`);
  }
  if (eventStages.size < expectedStages) {
    failures.push(`only ${eventStages.size}/${expectedStages} stage events were emitted`);
  }
  if (!reducedMotionPreviewPassed) {
    failures.push("reduced-motion preview did not settle into the nonessential-motion-free state");
  }

  return failures;
}

function recommendVariant(
  variant: AuditVariant,
  scores: RubricScores,
  failures: string[],
): "keep" | "redesign" | "delete" {
  if (variant.forcedRecommendation) {
    return variant.forcedRecommendation;
  }
  if (scores.scientificMeaning <= 2 || scores.visualClarity <= 2) {
    return "delete";
  }
  if (failures.length > 0) {
    return "redesign";
  }

  return averageScore(scores) >= 4.4 ? "keep" : "redesign";
}

function renderAuditReport(results: VariantAuditResult[]) {
  const ranked = [...results].sort((a, b) => averageScore(b.scores) - averageScore(a.scores));
  const lines = [
    "# Animation Audit Report",
    "",
    `Generated from Playwright recordings at ${new Date().toISOString()}.`,
    "",
    "Pass criteria: average FPS >= 55, no more than 5% frames above 33.3 ms, very few frames above 50 ms, no visible layout jump, complete lifecycle events, and reduced-motion preview support.",
    "",
    "## Ranking",
    "",
    "| Rank | Variant | Average score | Smoothness | FPS | >33ms | >50ms | Layout shift | Recommendation |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |",
  ];

  ranked.forEach((result, index) => {
    lines.push(
      `| ${index + 1} | ${result.variant.label} | ${averageScore(result.scores).toFixed(2)} | ${result.scores.smoothness} | ${result.metrics.averageFps.toFixed(2)} | ${(result.metrics.framesOver33Ratio * 100).toFixed(2)}% | ${result.metrics.framesOver50} | ${result.metrics.layoutShiftPx.toFixed(2)} px | ${result.recommendation} |`,
    );
  });

  lines.push("");
  lines.push("## Round 1 Vs Round 2");
  lines.push("");
  lines.push("| Variant | Round 1 classification | Round 2 classification | Change |");
  lines.push("| --- | --- | --- | --- |");

  const round1Classifications: Record<string, string> = {
    gibbs: "redesign",
    entropy: "redesign",
    formation: "redesign",
    bonds: "redesign",
  };

  for (const result of ranked) {
    lines.push(
      `| ${result.variant.label} | ${round1Classifications[result.variant.id]} | ${result.recommendation} | Redesigned as a chemistry operation sequence. |`,
    );
  }

  for (const removed of removedVariants) {
    lines.push(
      `| ${removed.label} | ${removed.round1} | ${removed.round2} | ${removed.reason} |`,
    );
  }

  lines.push("");
  lines.push("## Variant Details");
  lines.push("");

  for (const result of ranked) {
    lines.push(`### ${result.variant.label}`);
    lines.push("");
    lines.push(`- Recommendation: ${result.recommendation}`);
    lines.push(`- Video: \`${result.metrics.videoPath}\``);
    lines.push(`- Trace: \`${result.metrics.tracePath}\``);
    lines.push(`- Metrics: \`${result.metrics.metricsPath}\``);
    lines.push(`- Lifecycle events: ${result.metrics.events.length}`);
    lines.push(`- Long animation frame support: ${result.metrics.longAnimationFrame.supported ? "supported" : "unsupported"}`);
    lines.push(`- Failures: ${result.failures.length ? result.failures.join("; ") : "none"}`);
    lines.push("");
    lines.push("Scores:");
    lines.push(`- Smoothness: ${result.scores.smoothness}/5`);
    lines.push(`- Visual clarity: ${result.scores.visualClarity}/5`);
    lines.push(`- Scientific meaning: ${result.scores.scientificMeaning}/5`);
    lines.push(`- Timing and pacing: ${result.scores.timingAndPacing}/5`);
    lines.push(`- Integration with lesson text: ${result.scores.lessonIntegration}/5`);
    lines.push(`- Lack of visual noise: ${result.scores.lackOfVisualNoise}/5`);
    lines.push(`- Suitability for IB Chemistry students: ${result.scores.ibSuitability}/5`);
    lines.push("");
    lines.push("Pedagogical review:");
    lines.push(`- What it is trying to teach: ${result.variant.review.triesToTeach}`);
    lines.push(`- Visual sequence: ${result.variant.review.visualSequence}`);
    lines.push(`- Scientifically meaningful: ${result.variant.review.scientificMeaning}`);
    lines.push(`- Pacing: ${result.variant.review.pacing}`);
    lines.push(`- Production taste: ${result.variant.review.taste}`);
    lines.push("- Exact changes needed:");
    for (const change of result.variant.review.exactChangesNeeded) {
      lines.push(`  - ${change}`);
    }
    lines.push("");
    lines.push("Hard audit note:");
    lines.push(renderVariantNote(result));
    lines.push("");
  }

  lines.push("## Short Recommendation");
  lines.push("");
  for (const result of ranked) {
    lines.push(`- ${result.variant.label}: ${result.recommendation}`);
  }
  for (const removed of removedVariants) {
    lines.push(`- ${removed.label}: ${removed.round2}`);
  }

  return `${lines.join("\n")}\n`;
}

function renderVariantNote(result: VariantAuditResult) {
  if (result.recommendation === "keep") {
    if (result.variant.id === "gibbs") {
      return "Keep. The scene now teaches the equation by scaling T Delta S and letting the Delta G sign emerge from subtraction.";
    }

    if (result.variant.id === "entropy") {
      return "Keep. The scene now explains entropy with accessible-state counts instead of generic particle dispersal.";
    }

    if (result.variant.id === "formation") {
      return "Keep. The scene now follows the worksheet calculation: coefficients, formation values, subtotals, then products minus reactants.";
    }

    if (result.variant.id === "bonds") {
      return "Keep. The scene now separates energy required to break bonds from energy released when bonds form.";
    }

    return "Keep. The sequence is staged, chemically legible, and does not rely on perpetual motion.";
  }

  if (result.recommendation === "delete") {
    return "Delete. Smoothness is irrelevant here: the scene does not teach a specific thermodynamics concept and should not remain as a default.";
  }

  if (result.variant.id === "gibbs") {
    return "Redesign. The balance metaphor is useful, but the current sequence is too literal and too static to carry Delta G = Delta H - T Delta S.";
  }

  if (result.variant.id === "entropy") {
    return "Redesign. Particle dispersal is conceptually adjacent, but currently reads like generic dots instead of accessible-state reasoning.";
  }

  if (result.variant.id === "formation") {
    return "Redesign. The ledger direction is relevant, but it needs coefficient/value/subtotal logic and stronger visual hierarchy.";
  }

  if (result.variant.id === "bonds") {
    return "Redesign. The break/form concept is viable, but the action is too toy-like and does not make bond energy accounting convincing.";
  }

  return "Redesign. The core concept is viable, but the execution is not production-quality science education yet.";
}

function relativePath(filePath: string) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}
