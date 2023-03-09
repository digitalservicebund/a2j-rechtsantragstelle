import type { StepInterface } from "../steps";

export const exitHamburgOrBremen: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid red 1px", padding: "1rem" }}>
        <h2>Beratungshilfe nicht möglich</h2>
        <p>
          In Hamburg oder Bremen kannst du Unterstütztung von der öRA erhalten.
        </p>
      </div>
    );
  },
};
