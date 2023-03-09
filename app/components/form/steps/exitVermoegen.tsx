import type { StepInterface } from "../steps";

export const exitVermoegenStep: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid red 1px", padding: "1rem" }}>
        <h2>
          Wahrscheinlich ist ihr Vermögen zu hoch, um Beratungshilfe zu bekommen
        </h2>
        <p>
          Es gibt viele Organisationen, die kostenlose oder kostengünstige
          Rechtsberatungen anbieten:
          <a href=".">Tipps für kostengünstige Rechtsberatung</a>
        </p>
        <p>
          Ob sie Beratungsilfe erhalten, ist eine Einzelfallentscheidung des
          zuständigen Amtsgerichts - Sie können es also immer versuchen.
        </p>
      </div>
    );
  },
};
