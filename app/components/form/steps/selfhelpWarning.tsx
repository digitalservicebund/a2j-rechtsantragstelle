import type { StepInterface } from "../steps";

export const selfHelpWarning: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid yellow 1px", padding: "1rem" }}>
        <h2>
          Versuchen Sie zuerst, den Fall selbst zu klären. Sie erhalten sonst
          vielleicht keine Beratungshilfe.
        </h2>
        <p>
          Können Sie ohne Risiko die Gegenseite kontaktieren, um den Fall auch
          allein zu klären? Dann versuchen Sie es.
        </p>
        <p>
          In Fällen wie Scheidung, Familienrechtssachen oder Strafsachen müssen
          Sie das nicht tun - dann wird Beratungshilfe meistens auch so gewährt.
        </p>
      </div>
    );
  },
};
