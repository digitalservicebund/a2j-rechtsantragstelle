import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ hasRechtschutzversicherung: YesNoAnswer });

export const rechtSchutzVersicherungStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Haben Sie eine Rechtsschutzversicherung für diesen Fall?</h3>
        <p>
          Eine Rechtsschutzversicherung bezahlt Anwaltskosten. Je nach
          Versicherungs-Bedingungen können unterschiedliche Tätigkeiten bezahlt
          werden.
        </p>
        <p>
          Eine Rechtsschutzversicherung ist keine Pflicht-Versicherung. Sie
          müssen sie extra abgeschlossen haben.
        </p>
        <RadioGroup
          name={schema.keyof().Values.hasRechtschutzversicherung}
          options={[
            { label: "Nein", value: YesNoAnswer.enum.no },
            { label: "Ja", value: YesNoAnswer.enum.yes },
          ]}
        />
      </div>
    );
  },
};
