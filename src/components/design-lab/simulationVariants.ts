export type SimulationSceneKind =
  | "balance"
  | "landscape"
  | "entropy"
  | "coordinate"
  | "vectors"
  | "threshold"
  | "orbit"
  | "stack"
  | "conversion"
  | "formation"
  | "bonds"
  | "phase";

export type SimulationReference = {
  label: string;
  path: string;
};

export type SimulationVariant = {
  id: string;
  name: string;
  tone: "light" | "blackboard" | "blueprint" | "warm";
  scene: SimulationSceneKind;
  thesis: string;
  references: SimulationReference[];
  principles: string[];
  motionSpec: string[];
  usefulFor: string;
  doNotCopy: string;
};

export const simulationVariants: SimulationVariant[] = [
  {
    id: "gibbs-balance-instrument",
    name: "Gibbs Balance Instrument",
    tone: "light",
    scene: "balance",
    thesis:
      "The Gibbs equation becomes a calibrated balance: enthalpy loads one side, entropy-temperature loads the other, and the beam settles into feasibility.",
    references: [
      { label: "GSAP", path: "design-research/screenshots/awwwards-gsap.png" },
      {
        label: "Mechanical Watch",
        path: "design-research/screenshots/ciechanowski-mechanical-watch.png",
      },
      {
        label: "Stacked to Grouped Bars",
        path: "design-research/screenshots/observable-stacked-to-grouped-bars.png",
      },
    ],
    principles: [
      "Motion obeys a visible mechanism.",
      "Formula terms keep stable identities while the result changes.",
      "The zero line is an instrument reading, not a decorative axis.",
      "Elasticity is subtle and physically motivated.",
      "Labels attach to parts, not empty space.",
    ],
    motionSpec: [
      "Term loads enter from opposite sides.",
      "Beam rotates once and settles.",
      "Result marker slides along the feasibility gauge.",
    ],
    usefulFor:
      "Gibbs free energy lessons where students need to feel why Delta H and T Delta S compete.",
    doNotCopy:
      "Do not copy GSAP visual identity or Ciechanowski mechanical models; only borrow the mechanism-first discipline.",
  },
  {
    id: "free-energy-landscape",
    name: "Free Energy Landscape",
    tone: "blackboard",
    scene: "landscape",
    thesis:
      "A reaction sits on an energy surface. The visual teaches feasibility by letting particles flow downhill across the Delta G drop.",
    references: [
      {
        label: "Scroll Text Motion",
        path: "design-research/screenshots/codrops-scroll-text-motion.png",
      },
      {
        label: "Perspective Grid",
        path: "design-research/screenshots/codrops-scroll-3d-grid.png",
      },
      {
        label: "Force-Directed Graph",
        path: "design-research/screenshots/observable-force-directed-graph.png",
      },
    ],
    principles: [
      "A dark field can feel scientific when marks are sparse.",
      "Particles must follow a meaningful potential, not random drift.",
      "Depth supports the concept but never obscures the labels.",
      "One luminous trace is enough.",
      "Reduced motion still reads as an energy landscape.",
    ],
    motionSpec: [
      "Particle packet travels from reactants to products.",
      "Contour line breathes slowly.",
      "Delta G drop draws as a vertical bracket.",
    ],
    usefulFor:
      "Conceptual explanations of negative Delta G and reaction direction.",
    doNotCopy:
      "Do not copy Codrops dark typography or WebGL grids; make the landscape original and chemistry-specific.",
  },
  {
    id: "entropy-chamber",
    name: "Entropy Chamber",
    tone: "light",
    scene: "entropy",
    thesis:
      "Entropy is shown as dispersal inside a bounded chamber: particles move from ordered cluster to larger accessible space.",
    references: [
      {
        label: "Force-Directed Graph",
        path: "design-research/screenshots/observable-force-directed-graph.png",
      },
      {
        label: "Seeing Theory",
        path: "design-research/screenshots/seeing-theory-basic-probability.png",
      },
    ],
    principles: [
      "Physical constraints make particle motion legible.",
      "The container explains accessible states.",
      "Particle count and spread should be readable at rest.",
      "Friendly color can stay disciplined.",
      "Motion density should not become confetti.",
    ],
    motionSpec: [
      "Gate opens between ordered and dispersed chambers.",
      "Particles drift outward with bounded collisions implied.",
      "Entropy value pulses only after dispersal stabilizes.",
    ],
    usefulFor:
      "Entropy and standard molar entropy sections where students confuse randomness with dispersal.",
    doNotCopy:
      "Do not copy Seeing Theory illustrations or Observable data layouts.",
  },
  {
    id: "reaction-coordinate-trace",
    name: "Reaction Coordinate Trace",
    tone: "warm",
    scene: "coordinate",
    thesis:
      "The thermodynamic story is a single measured trace: reactants, transition, products, and Delta G are all visible on one coordinate.",
    references: [
      {
        label: "On Scroll Path",
        path: "design-research/screenshots/codrops-on-scroll-path.png",
      },
      {
        label: "Feature Visualization",
        path: "design-research/screenshots/distill-feature-visualization.png",
      },
    ],
    principles: [
      "Animated paths guide reading order.",
      "Sparse annotations beat decorative curve labels.",
      "The product/reactant gap must be the visual thesis.",
      "A trace should draw once, then hold.",
      "Warm paper can feel academic if the marks are exact.",
    ],
    motionSpec: [
      "Curve draws left to right.",
      "Product level snaps to final energy.",
      "Delta G bracket appears last.",
    ],
    usefulFor:
      "Introducing reaction profiles and connecting them to Gibbs sign.",
    doNotCopy:
      "Do not copy Codrops path shapes or Distill figure styling exactly.",
  },
  {
    id: "term-vector-field",
    name: "Term Vector Field",
    tone: "blueprint",
    scene: "vectors",
    thesis:
      "Delta H and T Delta S become opposing vectors, making the sign of Delta G a vector-result problem students can inspect.",
    references: [
      {
        label: "Brushable Scatterplot Matrix",
        path: "design-research/screenshots/observable-brushable-scatterplot-matrix.png",
      },
      {
        label: "Hierarchical Edge Bundling",
        path: "design-research/screenshots/observable-hierarchical-edge-bundling.png",
      },
    ],
    principles: [
      "Dense marks need exact alignment.",
      "Only active vectors should be saturated.",
      "Fine linework can carry serious scientific tone.",
      "Labels need to sit on the geometry.",
      "Motion should preserve term identity.",
    ],
    motionSpec: [
      "Delta H vector extends first.",
      "T Delta S vector extends in opposition.",
      "Resultant vector resolves to Delta G.",
    ],
    usefulFor:
      "Unit practice and formula structure, especially when signs are the main error.",
    doNotCopy:
      "Do not copy Observable datasets or matrix layouts.",
  },
  {
    id: "thermal-threshold-dial",
    name: "Thermal Threshold Dial",
    tone: "light",
    scene: "threshold",
    thesis:
      "Temperature becomes a controlled dial: as T increases, the -T Delta S term grows until the feasibility threshold is crossed.",
    references: [
      {
        label: "Wealth and Health of Nations",
        path: "design-research/screenshots/observable-wealth-health-nations.png",
      },
      {
        label: "Internal Combustion Engine",
        path: "design-research/screenshots/ciechanowski-internal-combustion.png",
      },
    ],
    principles: [
      "A stable threshold line makes change understandable.",
      "Controls must visually affect the mechanism.",
      "Temperature should feel continuous, not a badge.",
      "Motion tells a before/after story.",
      "The feasible boundary must be unmistakable.",
    ],
    motionSpec: [
      "Temperature needle sweeps upward.",
      "T Delta S bar scales with heat.",
      "Delta G marker crosses the zero boundary.",
    ],
    usefulFor:
      "High-temperature feasibility and threshold-temperature exercises.",
    doNotCopy:
      "Do not copy Observable playback UI or Ciechanowski engine parts.",
  },
  {
    id: "molecular-orbit-lens",
    name: "Molecular Orbit Lens",
    tone: "blackboard",
    scene: "orbit",
    thesis:
      "A magnified molecular lens connects microstate movement to macroscopic entropy and Gibbs outcome.",
    references: [
      {
        label: "Zoomable Circle Packing",
        path: "design-research/screenshots/observable-zoomable-circle-packing.png",
      },
      {
        label: "Zoom In",
        path: "design-research/screenshots/distill-circuits-zoom-in.png",
      },
    ],
    principles: [
      "Scale change can connect micro and macro explanations.",
      "The lens should not become decoration.",
      "Orbiting motion must be slow enough to inspect.",
      "Micro labels need restraint.",
      "The outer equation anchors the zoomed detail.",
    ],
    motionSpec: [
      "Lens halo expands around a particle cluster.",
      "Small molecules orbit within the lens.",
      "Macro Delta S label links back to the equation.",
    ],
    usefulFor:
      "Conceptual bridges from molecular motion to entropy in Gibbs calculations.",
    doNotCopy:
      "Do not copy Distill neural figures or Observable circle-packing composition.",
  },
  {
    id: "enthalpy-stack-calorimeter",
    name: "Enthalpy Stack Calorimeter",
    tone: "warm",
    scene: "stack",
    thesis:
      "Energy terms stack and unstack like measured calorimeter contributions, supporting formation enthalpy and Hess-style thinking.",
    references: [
      {
        label: "Stacked to Grouped Bars",
        path: "design-research/screenshots/observable-stacked-to-grouped-bars.png",
      },
      {
        label: "Women's Pockets",
        path: "design-research/screenshots/pudding-pockets.png",
      },
    ],
    principles: [
      "Object constancy matters when bars regroup.",
      "Measurements need a consistent scale.",
      "Annotations should be attached to the measured object.",
      "Warm color can signal heat without shouting.",
      "The result should emerge from the same marks.",
    ],
    motionSpec: [
      "Product terms stack on one side.",
      "Reactant terms stack on the other.",
      "Difference bracket animates between totals.",
    ],
    usefulFor:
      "Formation enthalpy and product-minus-reactant calculations.",
    doNotCopy:
      "Do not copy Pudding article styling or Observable chart code/data.",
  },
  {
    id: "unit-conversion-gate",
    name: "Unit Conversion Gate",
    tone: "blueprint",
    scene: "conversion",
    thesis:
      "The common J-to-kJ mistake becomes a physical gate: entropy must pass through conversion before entering the Gibbs equation.",
    references: [
      {
        label: "On-Scroll Column Rows",
        path: "design-research/screenshots/codrops-on-scroll-columns-rows.png",
      },
      {
        label: "Feature Visualization",
        path: "design-research/screenshots/distill-feature-visualization.png",
      },
    ],
    principles: [
      "A procedural animation can prevent common errors.",
      "The gate gives unit conversion a memorable physical role.",
      "Rows move as grouped structures.",
      "Wrong-path affordance should be visible but quiet.",
      "Text stays native and precise.",
    ],
    motionSpec: [
      "Entropy value enters as J.",
      "Conversion gate compresses by 1000.",
      "Converted value joins Delta H in the equation lane.",
    ],
    usefulFor:
      "Gibbs exercises where students mix entropy in joules with enthalpy in kilojoules.",
    doNotCopy:
      "Do not copy Codrops row choreography or Distill layout.",
  },
  {
    id: "formation-ledger-flow",
    name: "Formation Ledger Flow",
    tone: "light",
    scene: "formation",
    thesis:
      "Products and reactants become ledgers with coefficients as visible multipliers, then flow into the subtraction result.",
    references: [
      {
        label: "Webzibition",
        path: "design-research/screenshots/codrops-webzibition.png",
      },
      {
        label: "Interaction Design",
        path: "design-research/screenshots/awwwards-interaction-design.png",
      },
    ],
    principles: [
      "Rows can be animated specimens.",
      "Coefficient multiplication must be visible.",
      "Products and reactants need separate lanes.",
      "A ledger can feel refined without heavy borders.",
      "The final subtraction should be spatially obvious.",
    ],
    motionSpec: [
      "Coefficient chips expand into weighted values.",
      "Product lane and reactant lane total separately.",
      "Totals slide into products-minus-reactants bracket.",
    ],
    usefulFor:
      "Standard enthalpy of formation examples and exercises.",
    doNotCopy:
      "Do not copy Awwwards or Codrops archive UI; borrow the row rhythm only.",
  },
  {
    id: "bond-strain-map",
    name: "Bond Strain Map",
    tone: "blackboard",
    scene: "bonds",
    thesis:
      "Bonds broken and formed are shown as tension lines: breaking stores energy, forming releases it into the result.",
    references: [
      {
        label: "CSS and JS Animations",
        path: "design-research/screenshots/awwwards-css-js-animation.png",
      },
      {
        label: "Mechanical Watch",
        path: "design-research/screenshots/ciechanowski-mechanical-watch.png",
      },
    ],
    principles: [
      "Bond motion should feel mechanical, not magical.",
      "Breaking and forming need opposite visual behaviors.",
      "Energy release is a directional event.",
      "Line tension can explain bond enthalpy.",
      "Avoid cartoon molecule styling.",
    ],
    motionSpec: [
      "Broken-bond lines stretch and separate.",
      "Formed-bond lines snap into lower energy.",
      "Released energy trace flows to Delta H.",
    ],
    usefulFor:
      "Average bond enthalpy lessons and bond-counting errors.",
    doNotCopy:
      "Do not copy Awwwards animation thumbnails or Ciechanowski mechanics.",
  },
  {
    id: "phase-space-field",
    name: "Phase Space Field",
    tone: "blueprint",
    scene: "phase",
    thesis:
      "A compact phase-space field shows enthalpy and entropy conditions as regions, with the current reaction moving through feasibility space.",
    references: [
      {
        label: "Brushable Scatterplot Matrix",
        path: "design-research/screenshots/observable-brushable-scatterplot-matrix.png",
      },
      {
        label: "WEBGL Collection",
        path: "design-research/screenshots/awwwards-webgl-collection.png",
      },
    ],
    principles: [
      "Regions must be readable before interaction.",
      "The current reaction point is the main actor.",
      "Field density should feel scientific, not decorative.",
      "Axes and threshold boundaries do the teaching.",
      "Motion is a slow trajectory, not a loop for spectacle.",
    ],
    motionSpec: [
      "Reaction point travels across condition regions.",
      "Boundary line brightens at crossing.",
      "Feasibility label updates at the endpoint.",
    ],
    usefulFor:
      "Mixed practice and conceptual comparison of thermodynamic cases.",
    doNotCopy:
      "Do not copy Observable datasets or WebGL site effects.",
  },
];
