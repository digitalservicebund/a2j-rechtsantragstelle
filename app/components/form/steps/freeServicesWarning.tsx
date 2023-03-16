import type { StepInterface } from "../steps";

export const freeServicesWarning: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid yellow 1px", padding: "1rem" }}>
        <h2>
          Versuchen Sie zuerst, andere kostengünstige Beratung zu finden. Sie
          erhalten sonst vielleicht keine Beratungshilfe.
        </h2>
        <p>
          Für viele Probleme gibt es kostengünstige Rechtsberatungen - z.B.
          durch Mieterverein, Sozialverbände, Schuldnerberatung oder
          Gewerkschaften.
        </p>
        <p>
          Gibt es vielleicht eine solche Organisation in erreichbarer Nähe? Dann
          versuchen Sie, diese zu kontaktieren, bevor Sie Beratungshilfe
          beantragen.
        </p>
      </div>
    );
  },
};
