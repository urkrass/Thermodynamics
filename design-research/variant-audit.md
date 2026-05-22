# Simulation Variant Audit

Local screenshots: `design-research/local-variants/`

Rubric: 5 = visually strong, reference-quality, coherent, usable. 4 = promising and kept, with explicit refinement notes. 3 or below = rejected. The first mistaken UI-layout lab is rejected as wrong scope; this audit covers only simulation and animation variants.

## Kept Simulation Variants

### 01. Gibbs Balance Instrument - Score 5

- Screenshot: `design-research/local-variants/gibbs-balance-instrument.png`
- References compared: `awwwards-gsap.png`, `ciechanowski-mechanical-watch.png`, `observable-stacked-to-grouped-bars.png`.
- Discipline: Comparable. It has a single mechanical thesis, stable term identities, and restrained palette.
- Composition: Intentional. The beam, term loads, pivot, and feasibility gauge all support the equation.
- Integration: Strong. This would feel like the worksheet's core scientific instrument, not a pasted illustration.
- Generic React risk: Low. It is not a card/dashboard pattern; it is a diagrammatic mechanism.
- IB suitability: High.
- Needs redesign: Add numeric tick labels to the feasibility gauge before production.

### 02. Free Energy Landscape - Score 4

- Screenshot: `design-research/local-variants/free-energy-landscape.png`
- References compared: `codrops-scroll-text-motion.png`, `codrops-scroll-3d-grid.png`, `observable-force-directed-graph.png`.
- Discipline: Strong but atmospheric. The dark field is controlled, yet it risks feeling like a special feature rather than a default worksheet visual.
- Composition: Intentional. The contour, packet, product label, and Delta G drop are coherent.
- Integration: Good. It explains reaction direction directly.
- Generic React risk: Low.
- IB suitability: Medium-high.
- Needs redesign: Add an axis or energy-scale cue so the landscape is less mood-driven and more measurable.

### 03. Entropy Chamber - Score 5

- Screenshot: `design-research/local-variants/entropy-chamber.png`
- References compared: `observable-force-directed-graph.png`, `seeing-theory-basic-probability.png`.
- Discipline: Comparable. It is sparse, readable, and chemically meaningful at rest.
- Composition: Intentional. The boundary, divided chamber, particle cluster, and dispersed state all teach accessible states.
- Integration: Strong. It can replace the current entropy animation without changing lesson logic.
- Generic React risk: Low.
- IB suitability: High.
- Needs redesign: Add a subtle collision/path preview for the animated state.

### 04. Reaction Coordinate Trace - Score 5

- Screenshot: `design-research/local-variants/reaction-coordinate-trace.png`
- References compared: `codrops-on-scroll-path.png`, `distill-feature-visualization.png`.
- Discipline: Comparable. The trace is exact, the annotations are sparse, and the visual thesis is obvious.
- Composition: Intentional. Reactants, transition region, products, and Delta G are all in one reading path.
- Integration: Strong. It is a direct IB chemistry figure with better motion potential than the current side visual.
- Generic React risk: Low.
- IB suitability: High.
- Needs redesign: Add a separate activation-energy marker only when the lesson calls for kinetics.

### 05. Term Vector Field - Score 4

- Screenshot: `design-research/local-variants/term-vector-field.png`
- References compared: `observable-brushable-scatterplot-matrix.png`, `observable-hierarchical-edge-bundling.png`.
- Discipline: Promising. The geometry is clean after fixing paused-path visibility, but the vector relationship needs clearer arrowheads.
- Composition: Intentional. Opposing terms and resultant are readable.
- Integration: Good. It could teach signs and term competition in a compact side scene.
- Generic React risk: Low.
- IB suitability: High for sign errors and formula structure.
- Needs redesign: Add arrowheads and a clearer origin/result construction line.

### 06. Thermal Threshold Dial - Score 4

- Screenshot: `design-research/local-variants/thermal-threshold-dial.png`
- References compared: `observable-wealth-health-nations.png`, `ciechanowski-internal-combustion.png`.
- Discipline: Good. The threshold line, bar growth, and dial are conceptually aligned.
- Composition: Intentional. Temperature affects the entropy term and crosses the zero boundary.
- Integration: Good. It fits temperature-threshold exercises.
- Generic React risk: Medium-low because the bars can read as a conventional chart if the dial is not animated well.
- IB suitability: High.
- Needs redesign: Make the Delta G = 0 boundary and needle relationship more explicit.

### 07. Molecular Orbit Lens - Score 4

- Screenshot: `design-research/local-variants/molecular-orbit-lens.png`
- References compared: `observable-zoomable-circle-packing.png`, `distill-circuits-zoom-in.png`.
- Discipline: Good. The micro-to-macro idea is clear, though it is the most likely to become decorative.
- Composition: Intentional. The lens, orbit, and macro entropy label belong together.
- Integration: Good for conceptual entropy, less direct for calculation.
- Generic React risk: Low.
- IB suitability: Medium-high.
- Needs redesign: Tie the orbiting particles to a measured entropy change, not just a magnified motion loop.

### 08. Enthalpy Stack Calorimeter - Score 5

- Screenshot: `design-research/local-variants/enthalpy-stack-calorimeter.png`
- References compared: `observable-stacked-to-grouped-bars.png`, `pudding-pockets.png`.
- Discipline: Comparable. Bars, baseline, difference bracket, and warm palette make an exact measured figure.
- Composition: Intentional. Products and reactants are separated and the result emerges from their totals.
- Integration: Strong. It can directly support formation enthalpy and Hess-style arithmetic.
- Generic React risk: Low.
- IB suitability: High.
- Needs redesign: Add values beside bars in production so students can map marks to calculations.

### 09. Unit Conversion Gate - Score 5

- Screenshot: `design-research/local-variants/unit-conversion-gate.png`
- References compared: `codrops-on-scroll-columns-rows.png`, `distill-feature-visualization.png`.
- Discipline: Comparable. The gate is a memorable procedural figure without over-styling.
- Composition: Intentional. The value starts in J, passes through conversion, then becomes kJ.
- Integration: Strong. It targets a common student error and can animate in sequence with the worksheet.
- Generic React risk: Low-medium because rectangular value modules must stay procedural, not become generic cards.
- IB suitability: High.
- Needs redesign: Add a quiet wrong-path affordance for students who try to insert J directly.

### 10. Formation Ledger Flow - Score 4

- Screenshot: `design-research/local-variants/formation-ledger-flow.png`
- References compared: `codrops-webzibition.png`, `awwwards-interaction-design.png`.
- Discipline: Good, with a clear ledger rhythm.
- Composition: Intentional. Product and reactant lanes are separate and the subtraction destination is obvious.
- Integration: Good. It fits standard enthalpy of formation exercises.
- Generic React risk: Medium. The lane entries could become ordinary rounded UI blocks if not given numeric ledger behavior.
- IB suitability: High.
- Needs redesign: Replace placeholder species rows with coefficient, value, and subtotal columns before production.

### 11. Bond Strain Map - Score 4

- Screenshot: `design-research/local-variants/bond-strain-map.png`
- References compared: `awwwards-css-js-animation.png`, `ciechanowski-mechanical-watch.png`.
- Discipline: Good. Line tension and release are a serious alternative to cartoon molecule styling.
- Composition: Intentional. Breaking and forming are separated and connected by an energy trace.
- Integration: Good for bond enthalpy sections.
- Generic React risk: Low.
- IB suitability: Medium-high.
- Needs redesign: Add atom or bond-type labels so the mechanism does not become too abstract.

### 12. Phase Space Field - Score 5

- Screenshot: `design-research/local-variants/phase-space-field.png`
- References compared: `observable-brushable-scatterplot-matrix.png`, `awwwards-webgl-collection.png`.
- Discipline: Comparable. Regions, boundary, trajectory point, and labels are readable before interaction.
- Composition: Intentional. The scene teaches condition space rather than decorating the page.
- Integration: Strong for review or mixed-case comparison.
- Generic React risk: Low.
- IB suitability: High for conceptual comparison, medium for first exposure.
- Needs redesign: Add axis labels and a final feasibility state readout in production.

## Rejected Variants

The previous UI-layout variants are rejected as wrong scope:

- `editorial-figure`
- `kinetic-blackboard`
- `observable-notebook`
- `mechanism-cutaway`
- `path-ledger`
- `threshold-stage`
- `radial-system`
- `archive-rows`
- `perspective-plane`
- `manuscript-lab`
- `reaction-atlas`
- `calculation-specimen`

They were worksheet-shell explorations, not simulation or animation studies. They should not guide production except where their research notes overlap with figure discipline.

## Fixes Made During Audit

- Replaced the broad worksheet UI lab with 12 simulation-specific concepts.
- Restored the production worksheet styling and isolated new styling to the design-lab route.
- Fixed scientific labels so Delta notation renders from ASCII-safe Unicode escapes.
- Prevented long simulation titles from splitting inside words.
- Made drawn paths visible in paused/reduced-motion screenshots.
- Hid the Next.js dev overlay before Playwright screenshot capture.

## Production Recommendation

Use `gibbs-balance-instrument` as the default Gibbs free energy side simulation, then compose specialized scenes for relevant sections:

- Entropy: `entropy-chamber`
- Temperature threshold: `thermal-threshold-dial`
- Unit mistakes: `unit-conversion-gate`
- Formation enthalpy: `enthalpy-stack-calorimeter` or `formation-ledger-flow`
- Review/comparison: `phase-space-field`

Do not ship reference screenshots, copied layouts, copied animation timings, or third-party assets. The production simulation should be an original React/SVG implementation using these principles only.
