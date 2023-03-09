import type { StepInterface } from "../steps";

export const exitVermoegenUnknownStep: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid yellow 1px", padding: "1rem" }}>
        <h2>Prüfen Sie, wie hoch Ihr gesamtes Vermögen ist</h2>
        <p>Für den Antrag werden sie Angaben brauchen über...</p>
      </div>
    );
  },
};
