import type { StepInterface } from "../steps";

export const WelcomeStep: StepInterface = {
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h2>Vorab-check zur Beratungshilfe</h2>
        <p>
          Teste schnell und unkompliziert ob du berechtigt sein könntest,
          Beratungshilfe zu erhalten.
        </p>
        <p>Hinweis: Alle Aussagen sind unverbindlich.</p>
      </div>
    );
  },
};
