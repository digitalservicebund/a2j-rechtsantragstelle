import type { StepInterface } from "../steps";

export const exitVermoegenStep: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid red 1px", padding: "1rem" }}>
        <h2>
          Wahrscheinlich ist Ihr Vermögen zu hoch, um Beratungshilfe zu
          bekommen.
        </h2>
        <p>
          Ob Sie Beratungshilfe erhalten, ist eine Einzelfallentscheidung des
          zuständigen Amtsgerichts - Sie können es also immer versuchen.
        </p>
        <p>
          Wenn Sie begründen können, warum Sie auf Ihr Vermögen nicht zugreifen
          können, bekommen Sie vielleicht trotzdem Beratungshilfe.
        </p>
        <p>
          Es gibt viele Organisationen, die kostenlose oder kostengünstige
          Rechtsberatungen anbieten:
          <a href=".">Tipps für kostengünstige Rechtsberatung</a>
        </p>
      </div>
    );
  },
};
