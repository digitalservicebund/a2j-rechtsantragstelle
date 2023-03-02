import type { StepInterface } from "../StepInterface";

export const WelcomeStep: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h2>Welcome header</h2>
        <p>Welcome paragraph</p>
      </div>
    );
  },
};
