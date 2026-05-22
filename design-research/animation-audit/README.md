# Animation Audit Harness

This folder stores generated evidence from the `/animation-lab` route.

Run:

```bash
npm run test:animation
```

For a forced trace run:

```bash
npm run animation:audit
```

The Playwright spec records each finite animation sequence and writes:

- `videos/<variant>.webm`
- `traces/<variant>.zip`
- `metrics/<variant>.json`
- `audit.md`

The harness measures requestAnimationFrame timing, frame-delta thresholds, estimated FPS, layout stability, lifecycle events, and reduced-motion preview behavior. Long animation frame entries are recorded when Chromium exposes `long-animation-frame`; otherwise the metrics report marks that observer as unsupported rather than failing the run.

Round 2 writes to a separate folder:

```bash
npm run animation:audit:round2
```

That command sets `ANIMATION_AUDIT_OUTPUT_ROOT=design-research/animation-audit-round-2` and runs the same audit against the current `/animation-lab` route.

The route is audit-only. It must not change worksheet progression, answer checking, or localStorage persistence.
