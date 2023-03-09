import type { StepInterface } from "../steps";

export const exitBeratungshilfeBeantragt: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid red 1px", padding: "1rem" }}>
        <h2>Beratungshilfe nicht möglich</h2>
        <p>
          Wenn bereits Beratungshilfe beantragt wurde ist kein weiterer Antrag
          möglich.
        </p>
      </div>
    );
  },
};
