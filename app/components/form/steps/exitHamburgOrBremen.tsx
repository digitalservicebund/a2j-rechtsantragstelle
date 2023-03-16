import type { StepInterface } from "../steps";

export const exitHamburgOrBremen: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid red 1px", padding: "1rem" }}>
        <h2>In Hamburg und Bremen gibt es statt Beratungshilfe die </h2>
        <p>
          Die ÖRA (Öffentliche Rechtsauskunft- und Vergleichsstellen) bietet
          eine direkte Beratung durch Anwält:innen. Sie müssen nicht erst
          Beratungshilfe beantragen.
        </p>
        <p>
          <ul>
            <li>
              <a href="/">Zur ÖRA Hamburg</a>
            </li>
            <li>
              <a href="/">Zur ÖRA Bremen</a>
            </li>
          </ul>
        </p>
      </div>
    );
  },
};
