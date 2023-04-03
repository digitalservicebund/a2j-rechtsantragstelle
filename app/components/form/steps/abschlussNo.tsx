export const abschlussNoStep = {
  component: () => {
    return (
      <div style={{ border: "solid red 1px", padding: "1rem" }}>
        <h2>Sie würden wahrscheinlich keine Beratungshilfe erhalten</h2>
        <p>
          <strong>Ihr Einkommen ist wahrscheinlich zu hoch.</strong>
        </p>
        <p>
          Ob Sie Beratungshilfe erhalten, ist eine Einzelfallentscheidung des
          zuständigen Amtsgerichts. Dieser Test ist unverbindlich, und keine
          Entscheidung.
        </p>
        <p>
          <strong>Sie bekommen vielleicht trotzdem Beratungshilfe:</strong>
          <ul>
            <li>Wenn Sie auf das Einkommen nicht zugreifen können</li>
            <li>
              Wenn es großteils das Einkommen von einem Anghörigen ist (wie das
              Einkommen dann genau berechnet wird ist abhängig vom Fall)
            </li>
            <li>Wenn Sie weitere Kosten haben</li>
          </ul>
        </p>
        <p>
          Im Zweifel fragen Sie in der Rechtsantragsstelle Ihres Amtsgerichts
          nach.
        </p>
      </div>
    );
  },
};
