import { SimulationScene } from "@/components/design-lab/SimulationScene";
import type { SimulationVariant as SimulationVariantType } from "@/components/design-lab/simulationVariants";

type SimulationVariantProps = {
  index: number;
  variant: SimulationVariantType;
};

const DELTA = "\u0394";

export function SimulationVariant({ index, variant }: SimulationVariantProps) {
  return (
    <section
      className={`simulation-variant simulation-variant--${variant.tone}`}
      data-variant-id={variant.id}
      aria-labelledby={`${variant.id}-title`}
    >
      <div className="simulation-brief">
        <p className="simulation-number">
          Simulation {String(index + 1).padStart(2, "0")}
        </p>
        <h2 id={`${variant.id}-title`}>{variant.name}</h2>
        <p>{variant.thesis}</p>
        <div className="simulation-citations" aria-label="Reference screenshots">
          {variant.references.map((reference) => (
            <span key={reference.path}>
              {reference.label}: {reference.path}
            </span>
          ))}
        </div>
        <ul className="simulation-principles">
          {variant.principles.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>
      </div>

      <div className="simulation-panel">
        <div className="simulation-panel__header">
          <strong>Thermodynamics visual prototype</strong>
          <span>{`${DELTA}H = -92.4 | ${DELTA}S = -198.6 J mol^-1 K^-1 | T = 298 K`}</span>
        </div>
        <div className="simulation-stage">
          <SimulationScene kind={variant.scene} />
        </div>
        <div className="simulation-stage__notes">
          <div>
            <span>Motion model</span>
            <strong>{variant.motionSpec[0]}</strong>
          </div>
          <div>
            <span>Sequence</span>
            <strong>{variant.motionSpec[1]}</strong>
          </div>
          <div>
            <span>Use in worksheet</span>
            <strong>{variant.usefulFor}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
