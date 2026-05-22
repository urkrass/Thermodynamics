import { SimulationVariant } from "@/components/design-lab/SimulationVariant";
import { simulationVariants } from "@/components/design-lab/simulationVariants";

export function DesignLab() {
  return (
    <main className="design-lab-page">
      <header className="design-lab-intro">
        <p>Reference-driven simulation lab</p>
        <h1>Scientific motion studies</h1>
        <span>
          Twelve original animation directions for the worksheet simulations
          themselves: Gibbs balance, entropy dispersal, formation ledgers, bond
          strain, unit conversion, and phase-space reasoning. Reference
          screenshots are cited as internal research only; no third-party assets
          are rendered.
        </span>
      </header>

      <div className="simulation-stack">
        {simulationVariants.map((variant, index) => (
          <SimulationVariant key={variant.id} index={index} variant={variant} />
        ))}
      </div>
    </main>
  );
}
