import type { StepInterface } from "../steps";

export const ExitKlageEingereicht: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid red 1px", padding: "1rem" }}>
        <h2>Beratungshilfe nicht möglich</h2>
        <p>
          Bei bereits eingereichter Klage ist keine Beratungshilfe mehr möglich.
        </p>
      </div>
    );
  },
};
