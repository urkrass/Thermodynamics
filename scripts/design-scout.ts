/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("playwright") as typeof import("playwright");
const { mkdir, readFile, writeFile } = require("node:fs/promises") as typeof import("node:fs/promises");
const path = require("node:path") as typeof import("node:path");

type Browser = import("playwright").Browser;
type Page = import("playwright").Page;

type ReferenceAnalysis = {
  layout: string;
  typography: string;
  whitespace: string;
  color: string;
  motion: string;
  interaction: string;
  usable: string;
  mustNotCopy: string;
};

type DesignReference = {
  slug: string;
  source: string;
  category: string;
  url: string;
  title: string;
  notes: string;
  analysis: ReferenceAnalysis;
  principles: string[];
  takeaways: string[];
};

type CaptureRecord = {
  slug: string;
  url: string;
  title: string;
  category: string;
  screenshot: string | null;
  fullPageScreenshot: string | null;
  ok: boolean;
  error?: string;
};

const repoRoot = path.resolve(__dirname, "..");
const researchDir = path.join(repoRoot, "design-research");
const screenshotsDir = path.join(researchDir, "screenshots");
const localVariantsDir = path.join(researchDir, "local-variants");
const referencesPath = path.join(researchDir, "references.json");
const referenceBoardPath = path.join(researchDir, "reference-board.md");
const captureLogPath = path.join(researchDir, "capture-log.json");

function toPosix(relativePath: string) {
  return relativePath.split(path.sep).join("/");
}

async function loadReferences() {
  const raw = await readFile(referencesPath, "utf8");
  return JSON.parse(raw) as DesignReference[];
}

async function waitForSettledPage(page: Page) {
  await page.waitForLoadState("domcontentloaded", { timeout: 45_000 });
  await page.waitForLoadState("networkidle", { timeout: 12_000 }).catch(() => {
    // Some editorial and WebGL pages keep long-lived connections open.
  });
  await page.waitForTimeout(1_500);
}

async function hideLocalDevOverlays(page: Page) {
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

async function captureReference(page: Page, reference: DesignReference) {
  const screenshot = path.join(screenshotsDir, `${reference.slug}.png`);
  const fullPageScreenshot = path.join(screenshotsDir, `${reference.slug}-full.png`);

  try {
    await page.goto(reference.url, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });
    await waitForSettledPage(page);

    const title = (await page.title()) || reference.title;
    await page.screenshot({
      path: screenshot,
      fullPage: false,
      animations: "disabled",
      timeout: 20_000,
    });

    let fullPagePath: string | null = toPosix(
      path.relative(repoRoot, fullPageScreenshot),
    );

    try {
      const height = await page.evaluate(() => {
        return Math.max(
          document.documentElement.scrollHeight,
          document.body?.scrollHeight ?? 0,
        );
      });

      if (height > 0 && height <= 14_000) {
        await page.screenshot({
          path: fullPageScreenshot,
          fullPage: true,
          animations: "disabled",
          timeout: 30_000,
        });
      } else {
        fullPagePath = null;
      }
    } catch {
      fullPagePath = null;
    }

    return {
      slug: reference.slug,
      url: reference.url,
      title,
      category: reference.category,
      screenshot: toPosix(path.relative(repoRoot, screenshot)),
      fullPageScreenshot: fullPagePath,
      ok: true,
    } satisfies CaptureRecord;
  } catch (error) {
    return {
      slug: reference.slug,
      url: reference.url,
      title: reference.title,
      category: reference.category,
      screenshot: null,
      fullPageScreenshot: null,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    } satisfies CaptureRecord;
  }
}

function renderReferenceBoard(references: DesignReference[], captures: CaptureRecord[]) {
  const captureBySlug = new Map(captures.map((capture) => [capture.slug, capture]));
  const lines = [
    "# Thermodynamics Simulation Reference Board",
    "",
    "Screenshots in this folder are internal research artifacts only. Production simulation work must use original code, original drawings, and no copied logos, photography, screenshots, or third-party visual assets.",
    "",
  ];

  for (const reference of references) {
    const capture = captureBySlug.get(reference.slug);
    const screenshotPath =
      capture?.screenshot ?? `design-research/screenshots/${reference.slug}.png`;

    lines.push(`## ${reference.title}`);
    lines.push("");
    lines.push(`- Source URL: ${reference.url}`);
    lines.push(`- Local screenshot: ${screenshotPath}`);
    lines.push(`- Category: ${reference.category}`);
    lines.push(`- Notes: ${reference.notes}`);
    lines.push("");
    lines.push("Visual analysis:");
    lines.push(`- Layout structure: ${reference.analysis.layout}`);
    lines.push(`- Typography: ${reference.analysis.typography}`);
    lines.push(`- Whitespace rhythm: ${reference.analysis.whitespace}`);
    lines.push(`- Color discipline: ${reference.analysis.color}`);
    lines.push(`- Animation/motion character: ${reference.analysis.motion}`);
    lines.push(`- Interaction style: ${reference.analysis.interaction}`);
    lines.push(`- Usable for worksheet: ${reference.analysis.usable}`);
    lines.push(`- Must not copy: ${reference.analysis.mustNotCopy}`);
    lines.push("");
    lines.push("Five visual principles:");
    for (const principle of reference.principles.slice(0, 5)) {
      lines.push(`- ${principle}`);
    }
    lines.push("");
    lines.push("Three simulation takeaways:");
    for (const takeaway of reference.takeaways.slice(0, 3)) {
      lines.push(`- ${takeaway}`);
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

async function captureReferences() {
  await mkdir(screenshotsDir, { recursive: true });
  const references = await loadReferences();
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const captures: CaptureRecord[] = [];

  for (const reference of references) {
    console.log(`Capturing ${reference.slug} -> ${reference.url}`);
    captures.push(await captureReference(page, reference));
  }

  await browser.close();
  await writeFile(captureLogPath, `${JSON.stringify(captures, null, 2)}\n`);
  await writeFile(referenceBoardPath, renderReferenceBoard(references, captures));

  const okCount = captures.filter((capture) => capture.ok).length;
  console.log(`Captured ${okCount}/${captures.length} references.`);
  if (okCount < 20) {
    throw new Error(
      `Only ${okCount} references captured. Add replacement URLs and rerun.`,
    );
  }
}

async function captureLocalVariants(baseUrl: string) {
  await mkdir(localVariantsDir, { recursive: true });
  const browser: Browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await waitForSettledPage(page);
  await hideLocalDevOverlays(page);

  const ids = await page.locator("[data-variant-id]").evaluateAll((nodes) =>
    nodes
      .map((node) => node.getAttribute("data-variant-id"))
      .filter((id): id is string => Boolean(id)),
  );

  for (const id of ids) {
    const locator = page.locator(`[data-variant-id="${id}"]`);
    await locator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await locator.screenshot({
      path: path.join(localVariantsDir, `${id}.png`),
      animations: "disabled",
      timeout: 20_000,
    });
    console.log(`Captured local variant ${id}`);
  }

  await browser.close();
  if (ids.length < 12) {
    throw new Error(`Expected 12 variants; found ${ids.length}.`);
  }
}

async function main() {
  const command = process.argv[2] ?? "references";

  if (command === "references") {
    await captureReferences();
    return;
  }

  if (command === "variants") {
    const baseArg = process.argv.find((arg) => arg.startsWith("--base="));
    const baseUrl = baseArg?.slice("--base=".length) ?? "http://localhost:3000/design-lab";
    await captureLocalVariants(baseUrl);
    return;
  }

  throw new Error(
    `Unknown command "${command}". Use "references" or "variants --base=http://localhost:3000/design-lab".`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
