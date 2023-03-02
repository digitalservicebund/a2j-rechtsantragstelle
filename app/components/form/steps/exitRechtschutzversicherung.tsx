import type { StepInterface } from "../steps";

export const ExitRechtschutzversicherungStep: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid red 1px", padding: "1rem" }}>
        <h2>Beratungshilfe nicht möglich</h2>
        <p>
          Leider kann bei einer bestehender Rechtschutzversicherung keine
          Beratungshilfe. Bitte wende dich an deine Rechtschutzversicherung
        </p>
      </div>
    );
  },
};
