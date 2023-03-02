import type { StepInterface } from "../steps";

export const SuccessStep: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid green 1px", padding: "1rem" }}>
        <h2>Erfolg</h2>
        <p>!</p>
      </div>
    );
  },
};
