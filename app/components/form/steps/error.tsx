import type { StepInterface } from "../StepInterface";

export const ErrorStep: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid red 1px", padding: "1rem" }}>
        <h2>ERROR</h2>
        <p>Nicht erfolgreich</p>
      </div>
    );
  },
};
