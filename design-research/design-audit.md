# Simulation Design Audit

## Corrected Scope

The design target is the worksheet's scientific simulation and animation language, not a new overall worksheet UI. The production lesson shell, answer checking, navigation, progress storage, and Typeform-style lesson flow should stay intact unless a simulation integration requires a narrow adjustment.

The design lab now studies visual explanations for Gibbs free energy, entropy dispersal, formation enthalpy, bond enthalpy, unit conversion, threshold temperature, and feasibility regions. Each variant is an original SVG/CSS/React scene derived from reference principles, not copied assets.

## Current Simulation Diagnosis

The existing side visual is educationally useful but too isolated. It behaves like a side animation beside the worksheet rather than a scientific instrument that students can read. The next production pass should make the simulation more like a figure in a high-quality science explainer:

- Stable axes, gauges, chambers, or ledgers should carry the concept.
- Formula terms should keep visual identity across the motion.
- Labels should attach to the measured object, not float as decoration.
- Motion should reveal causality: term loading, dispersal, threshold crossing, conversion, difference, or trajectory.
- The paused or reduced-motion state must still communicate the same idea.

## Reference-Derived Principles

- From Ciechanowski-style explainers: make motion obey a visible mechanism.
- From Observable examples: use exact geometry, readable scales, and object constancy.
- From Codrops motion studies: choreograph one clear reveal instead of animating everything.
- From Distill-style scientific writing: keep labels sparse and attached to evidence.
- From editorial interactive references: use restraint, high contrast, and one dominant visual thesis.

## Production Direction

The strongest production candidates are:

- `gibbs-balance-instrument` for the core Gibbs equation.
- `entropy-chamber` for entropy and dispersal.
- `thermal-threshold-dial` for temperature-driven feasibility.
- `unit-conversion-gate` for J-to-kJ mistakes.
- `formation-ledger-flow` and `enthalpy-stack-calorimeter` for product-minus-reactant workflows.
- `phase-space-field` for mixed conceptual review.

Avoid shipping reference screenshots, third-party thumbnails, logos, copied article layouts, copied colors, or copied choreography. The references are evidence for taste and motion discipline only.
