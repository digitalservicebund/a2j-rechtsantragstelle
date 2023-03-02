import type { StepInterface } from "../steps";

export const SozialleistungStep: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid green 1px", padding: "1rem" }}>
        <h2>Beziehst du Sozialleistungen?</h2>
        <p>...</p>
      </div>
    );
  },
};
