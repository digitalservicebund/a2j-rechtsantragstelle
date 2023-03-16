import type { StepInterface } from "../steps";

export const exitRechtschutzversicherungStep: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid red 1px", padding: "1rem" }}>
        <h2>Klären Sie mit Ihrer Versicherung, ob sie den Fall bezahlt.</h2>
        <p>
          Wenn Sie eine Rechtsschutzversicherung haben, die diesen Fall abdeckt,
          werden Sie keine Beratungshilfe bekommen.
        </p>
      </div>
    );
  },
};
