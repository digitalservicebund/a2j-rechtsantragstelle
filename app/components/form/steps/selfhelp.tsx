import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ hasHelpedThemselves: YesNoAnswer });

export const selfHelpStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Haben Sie schon versucht, die Angelegenheit selbst zu klären?</h3>
        <p>
          Haben Sie z.B. die Gegenseite kontaktiert, einen Brief geschrieben
          oder Beschwerde eingelegt?
        </p>
        <RadioGroup
          name={schema.keyof().Values.hasHelpedThemselves}
          options={[
            { label: "Nein", value: YesNoAnswer.Enum.no },
            { label: "Ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
