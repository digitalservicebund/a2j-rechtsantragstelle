import type { StepInterface } from "../StepInterface";

export const Step: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid green 1px", padding: "1rem" }}>
        <h2>Erfolg</h2>
        <p>!</p>
      </div>
    );
  },
};
