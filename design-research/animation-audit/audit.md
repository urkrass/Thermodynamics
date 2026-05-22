# Animation Audit Report

Generated from Playwright recordings at 2026-05-22T10:03:44.129Z.

Pass criteria: average FPS >= 55, no more than 5% frames above 33.3 ms, very few frames above 50 ms, no visible layout jump, complete lifecycle events, and reduced-motion preview support.

## Ranking

| Rank | Variant | Average score | Smoothness | FPS | >33ms | >50ms | Layout shift | Recommendation |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | Gibbs free energy | 3.43 | 5 | 59.83 | 0.59% | 0 | 0.00 px | redesign |
| 2 | Formation enthalpy | 3.43 | 5 | 60.00 | 0.00% | 0 | 0.00 px | redesign |
| 3 | Entropy | 3.29 | 5 | 60.00 | 0.00% | 0 | 0.00 px | redesign |
| 4 | Bond enthalpy | 2.71 | 5 | 60.00 | 0.00% | 0 | 0.00 px | redesign |
| 5 | Intro/default particles | 2.29 | 5 | 60.00 | 0.00% | 0 | 0.00 px | delete |

## Variant Details

### Gibbs free energy

- Recommendation: redesign
- Video: `design-research/animation-audit/videos/gibbs.webm`
- Trace: `design-research/animation-audit/traces/gibbs.zip`
- Metrics: `design-research/animation-audit/metrics/gibbs.json`
- Lifecycle events: 7
- Long animation frame support: supported
- Failures: none

Scores:
- Smoothness: 5/5
- Visual clarity: 3/5
- Scientific meaning: 3/5
- Timing and pacing: 3/5
- Integration with lesson text: 3/5
- Lack of visual noise: 4/5
- Suitability for IB Chemistry students: 3/5

Pedagogical review:
- What it is trying to teach: Whether Delta H, T Delta S, and Delta G make a process spontaneous.
- Visual sequence: Terms appear as balanced quantities and settle into a favorable or unfavorable Gibbs result.
- Scientifically meaningful: Partly meaningful, but too metaphorical. It gestures at the equation without making the subtraction, sign convention, or temperature dependence unavoidable.
- Pacing: The stages are orderly, but the conceptual beats do not give students enough time to connect each term to the formula.
- Production taste: Restrained enough to refine, but still reads like a polite UI animation rather than a serious science simulation.
- Exact changes needed:
  - Make Delta H and T Delta S behave as measured competing quantities, not decorative labels.
  - Show the sign of Delta G emerging from the arithmetic and map negative/positive to spontaneity.
  - Let temperature visibly scale the entropy term so the equation explains the motion.

Hard audit note:
Redesign. The balance metaphor is useful, but the current sequence is too literal and too static to carry Delta G = Delta H - T Delta S.

### Formation enthalpy

- Recommendation: redesign
- Video: `design-research/animation-audit/videos/formation.webm`
- Trace: `design-research/animation-audit/traces/formation.zip`
- Metrics: `design-research/animation-audit/metrics/formation.json`
- Lifecycle events: 7
- Long animation frame support: supported
- Failures: none

Scores:
- Smoothness: 5/5
- Visual clarity: 3/5
- Scientific meaning: 3/5
- Timing and pacing: 3/5
- Integration with lesson text: 3/5
- Lack of visual noise: 4/5
- Suitability for IB Chemistry students: 3/5

Pedagogical review:
- What it is trying to teach: Formation enthalpy as product formation values minus reactant formation values.
- Visual sequence: Reactant and product values are arranged into a ledger-like comparison and summed.
- Scientifically meaningful: The accounting idea is useful, but the current scene is too static and table-like. It does not make coefficients, subtotals, and sign changes feel like the core concept.
- Pacing: Calm, but not explanatory enough; students can watch without learning the calculation flow.
- Production taste: The least noisy direction, but visually too sterile to justify animation.
- Exact changes needed:
  - Animate coefficients multiplying formation values before summing.
  - Separate products and reactants into two clear subtotals, then subtract.
  - Show why elements in standard states contribute zero when relevant.

Hard audit note:
Redesign. The ledger direction is relevant, but it needs coefficient/value/subtotal logic and stronger visual hierarchy.

### Entropy

- Recommendation: redesign
- Video: `design-research/animation-audit/videos/entropy.webm`
- Trace: `design-research/animation-audit/traces/entropy.zip`
- Metrics: `design-research/animation-audit/metrics/entropy.json`
- Lifecycle events: 7
- Long animation frame support: supported
- Failures: none

Scores:
- Smoothness: 5/5
- Visual clarity: 3/5
- Scientific meaning: 3/5
- Timing and pacing: 3/5
- Integration with lesson text: 3/5
- Lack of visual noise: 3/5
- Suitability for IB Chemistry students: 3/5

Pedagogical review:
- What it is trying to teach: Entropy as the increase in accessible arrangements and dispersal of energy.
- Visual sequence: Particles move from a constrained arrangement toward a more dispersed arrangement.
- Scientifically meaningful: Directionally relevant, but weak. It risks teaching 'entropy means dots spread out' instead of accessible microstates or energy dispersal.
- Pacing: Readable, but the explanation is too generic and the important state comparison is under-emphasized.
- Production taste: Clean but not distinctive; it still feels close to generic particle decoration.
- Exact changes needed:
  - Replace random dispersal with a before/after microstate-count comparison.
  - Make the constraint release or energy distribution explicit.
  - Remove any particle motion that is not tied to the entropy explanation.

Hard audit note:
Redesign. Particle dispersal is conceptually adjacent, but currently reads like generic dots instead of accessible-state reasoning.

### Bond enthalpy

- Recommendation: redesign
- Video: `design-research/animation-audit/videos/bonds.webm`
- Trace: `design-research/animation-audit/traces/bonds.zip`
- Metrics: `design-research/animation-audit/metrics/bonds.json`
- Lifecycle events: 7
- Long animation frame support: supported
- Failures: none

Scores:
- Smoothness: 5/5
- Visual clarity: 2/5
- Scientific meaning: 2/5
- Timing and pacing: 3/5
- Integration with lesson text: 2/5
- Lack of visual noise: 3/5
- Suitability for IB Chemistry students: 2/5

Pedagogical review:
- What it is trying to teach: Bond enthalpy as energy required to break bonds minus energy released when bonds form.
- Visual sequence: Bonds break and reform while energy labels or totals appear.
- Scientifically meaningful: The direction is correct, but the execution feels toy-like. It does not convincingly distinguish breaking as endothermic and forming as exothermic accounting.
- Pacing: The beats are present but do not build a reliable calculation narrative.
- Production taste: Too close to a generic molecule wiggle; it needs a more disciplined chemistry-diagram language.
- Exact changes needed:
  - Use a clear reaction map with bonds-to-break and bonds-to-form counted separately.
  - Animate energy arrows up for breaking and down for forming with real subtotal logic.
  - Reduce molecule motion and make every movement correspond to a bond-energy operation.

Hard audit note:
Redesign. The break/form concept is viable, but the action is too toy-like and does not make bond energy accounting convincing.

### Intro/default particles

- Recommendation: delete
- Video: `design-research/animation-audit/videos/particles.webm`
- Trace: `design-research/animation-audit/traces/particles.zip`
- Metrics: `design-research/animation-audit/metrics/particles.json`
- Lifecycle events: 7
- Long animation frame support: supported
- Failures: none

Scores:
- Smoothness: 5/5
- Visual clarity: 2/5
- Scientific meaning: 1/5
- Timing and pacing: 3/5
- Integration with lesson text: 1/5
- Lack of visual noise: 2/5
- Suitability for IB Chemistry students: 2/5

Pedagogical review:
- What it is trying to teach: A general introductory sense of particles or molecular motion.
- Visual sequence: Particles drift through a finite sequence with subtle staged changes.
- Scientifically meaningful: Not meaningful enough for this worksheet. It is generic motion, not thermodynamics instruction.
- Pacing: Smooth, but smoothness does not rescue the absence of a clear concept.
- Production taste: This is the wrong direction: it reads as decorative filler.
- Exact changes needed:
  - Delete from the serious animation set.
  - Replace only if a future intro scene teaches a specific measurable thermodynamics idea.
  - Do not reuse generic drifting particles as a default production fallback.

Hard audit note:
Delete. Smoothness is irrelevant here: the scene does not teach a specific thermodynamics concept and should not remain as a default.

## Short Recommendation

- Gibbs free energy: redesign
- Formation enthalpy: redesign
- Entropy: redesign
- Bond enthalpy: redesign
- Intro/default particles: delete
