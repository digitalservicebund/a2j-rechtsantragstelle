import type { StepInterface } from "../steps";

export const exitKlageEingereicht: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid red 1px", padding: "1rem" }}>
        <h2>Für Ihren Fall gibt es die Prozesskostenhilfe</h2>
        <p>
          Prozesskostenhilfe ist zuständig wenn es in einem Fall bereits zu
          einer Klage gekommen ist.
        </p>
        <p>
          <a href="">Mehr zur Prozesskostenhilfe</a>
        </p>
      </div>
    );
  },
};
