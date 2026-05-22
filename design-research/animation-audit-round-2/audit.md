# Animation Audit Report

Generated from Playwright recordings at 2026-05-22T10:17:38.739Z.

Pass criteria: average FPS >= 55, no more than 5% frames above 33.3 ms, very few frames above 50 ms, no visible layout jump, complete lifecycle events, and reduced-motion preview support.

## Ranking

| Rank | Variant | Average score | Smoothness | FPS | >33ms | >50ms | Layout shift | Recommendation |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | Gibbs free energy | 4.57 | 5 | 59.84 | 0.00% | 0 | 0.00 px | keep |
| 2 | Entropy | 4.57 | 5 | 59.81 | 0.32% | 0 | 0.00 px | keep |
| 3 | Formation enthalpy | 4.57 | 5 | 59.82 | 0.30% | 0 | 0.00 px | keep |
| 4 | Bond enthalpy | 4.57 | 5 | 59.45 | 0.62% | 0 | 0.00 px | keep |

## Round 1 Vs Round 2

| Variant | Round 1 classification | Round 2 classification | Change |
| --- | --- | --- | --- |
| Gibbs free energy | redesign | keep | Redesigned as a chemistry operation sequence. |
| Entropy | redesign | keep | Redesigned as a chemistry operation sequence. |
| Formation enthalpy | redesign | keep | Redesigned as a chemistry operation sequence. |
| Bond enthalpy | redesign | keep | Redesigned as a chemistry operation sequence. |
| Intro/default particles | delete | removed from active animation lab | The scene was smooth but generic. It did not teach a measurable thermodynamics operation, so round 2 removes it instead of polishing it. |

## Variant Details

### Gibbs free energy

- Recommendation: keep
- Video: `design-research/animation-audit-round-2/videos/gibbs.webm`
- Trace: `design-research/animation-audit-round-2/traces/gibbs.zip`
- Metrics: `design-research/animation-audit-round-2/metrics/gibbs.json`
- Lifecycle events: 7
- Long animation frame support: supported
- Failures: none

Scores:
- Smoothness: 5/5
- Visual clarity: 4/5
- Scientific meaning: 5/5
- Timing and pacing: 4/5
- Integration with lesson text: 5/5
- Lack of visual noise: 4/5
- Suitability for IB Chemistry students: 5/5

Pedagogical review:
- What it is trying to teach: Whether Delta H, T Delta S, and Delta G make a process spontaneous.
- Visual sequence: The equation appears, Delta H is fixed, temperature scales T Delta S, the subtraction converges into Delta G, and the sign is checked on a spontaneous/non-spontaneous rail.
- Scientifically meaningful: Meaningful enough to keep refining. The animation now makes temperature scaling and the final sign part of the equation rather than a separate decoration.
- Pacing: The beats are slower and closer to the algebraic sequence; the result does not appear before the terms are introduced.
- Production taste: Restrained and diagrammatic. It feels closer to a science explanation than a generic UI metaphor.
- Exact changes needed:
  - Refine numeric typography so units and signs remain readable at worksheet scale.
  - Consider adding a second temperature state later to show sign reversal.
  - Keep the motion tied to the equation; do not reintroduce a balance metaphor unless it carries the arithmetic.

Hard audit note:
Keep. The scene now teaches the equation by scaling T Delta S and letting the Delta G sign emerge from subtraction.

### Entropy

- Recommendation: keep
- Video: `design-research/animation-audit-round-2/videos/entropy.webm`
- Trace: `design-research/animation-audit-round-2/traces/entropy.zip`
- Metrics: `design-research/animation-audit-round-2/metrics/entropy.json`
- Lifecycle events: 7
- Long animation frame support: supported
- Failures: none

Scores:
- Smoothness: 5/5
- Visual clarity: 4/5
- Scientific meaning: 4/5
- Timing and pacing: 4/5
- Integration with lesson text: 5/5
- Lack of visual noise: 5/5
- Suitability for IB Chemistry students: 5/5

Pedagogical review:
- What it is trying to teach: Entropy as the increase in accessible arrangements and dispersal of energy.
- Visual sequence: A constrained state with two accessible locations becomes an unlocked state with more locations; microstate rows reveal the larger count before Delta S is concluded.
- Scientifically meaningful: Substantially better. It no longer depends on random dot dispersal and instead compares W_initial with W_final.
- Pacing: Suitable for students: the unlock, count, compare, and formula steps are separate enough to follow.
- Production taste: Clean, quiet, and mathematical. It is still simple, but it is no longer decorative filler.
- Exact changes needed:
  - Keep the state-count idea, but make the microstate grid even more legible if it enters production.
  - Add a short text coupling to the lesson paragraph so students know W means accessible arrangements.
  - Avoid adding drifting particles back into this scene.

Hard audit note:
Keep. The scene now explains entropy with accessible-state counts instead of generic particle dispersal.

### Formation enthalpy

- Recommendation: keep
- Video: `design-research/animation-audit-round-2/videos/formation.webm`
- Trace: `design-research/animation-audit-round-2/traces/formation.zip`
- Metrics: `design-research/animation-audit-round-2/metrics/formation.json`
- Lifecycle events: 7
- Long animation frame support: supported
- Failures: none

Scores:
- Smoothness: 5/5
- Visual clarity: 4/5
- Scientific meaning: 5/5
- Timing and pacing: 4/5
- Integration with lesson text: 5/5
- Lack of visual noise: 4/5
- Suitability for IB Chemistry students: 5/5

Pedagogical review:
- What it is trying to teach: Formation enthalpy as product formation values minus reactant formation values.
- Visual sequence: The balanced combustion equation appears, coefficient-times-formation-value rows reveal, subtotals are built, then products minus reactants resolves Delta H.
- Scientifically meaningful: Meaningful and worksheet-aligned. The motion now corresponds to the exact calculation students perform.
- Pacing: Paced as a calculation sequence rather than a static table.
- Production taste: Still ledger-like, but intentionally so; it reads as refined chemistry accounting rather than a dashboard.
- Exact changes needed:
  - Tune row density for the production side visual so it stays readable in the smaller worksheet column.
  - Consider highlighting standard-state zero values only when the lesson text introduces them.
  - Keep coefficients visible; hiding them would collapse the point of the scene.

Hard audit note:
Keep. The scene now follows the worksheet calculation: coefficients, formation values, subtotals, then products minus reactants.

### Bond enthalpy

- Recommendation: keep
- Video: `design-research/animation-audit-round-2/videos/bonds.webm`
- Trace: `design-research/animation-audit-round-2/traces/bonds.zip`
- Metrics: `design-research/animation-audit-round-2/metrics/bonds.json`
- Lifecycle events: 7
- Long animation frame support: supported
- Failures: none

Scores:
- Smoothness: 5/5
- Visual clarity: 4/5
- Scientific meaning: 5/5
- Timing and pacing: 4/5
- Integration with lesson text: 5/5
- Lack of visual noise: 4/5
- Suitability for IB Chemistry students: 5/5

Pedagogical review:
- What it is trying to teach: Bond enthalpy as energy required to break bonds minus energy released when bonds form.
- Visual sequence: H-H and Cl-Cl bonds split under upward energy arrows, H-Cl bonds form under downward release arrows, then the +678 and -862 ledgers resolve to -184.
- Scientifically meaningful: Meaningful enough to keep. The animation now separates energy input and energy released and uses real bond-energy subtotals.
- Pacing: The staged lanes make the calculation narrative much clearer than the previous molecule wiggle.
- Production taste: More disciplined and diagrammatic. The molecule movement is minimal and tied to the bond operation.
- Exact changes needed:
  - If it moves into production, use the actual reaction from the active worksheet step.
  - Keep the energy arrows and ledgers visually dominant over molecule motion.
  - Add a compact legend for broken versus formed if students find the lane labels insufficient.

Hard audit note:
Keep. The scene now separates energy required to break bonds from energy released when bonds form.

## Short Recommendation

- Gibbs free energy: keep
- Entropy: keep
- Formation enthalpy: keep
- Bond enthalpy: keep
- Intro/default particles: removed from active animation lab
