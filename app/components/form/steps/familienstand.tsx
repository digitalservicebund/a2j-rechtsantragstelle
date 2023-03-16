import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ partnerschaft: YesNoAnswer });

export const familienstandStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid green 1px", padding: "1rem" }}>
        <h2>
          Sind sie verheiratet oder in einer eingetragenen Lebenspartnerschaft?
        </h2>
        <p>
          Die gemeinsamen Einkünfte und Kosten in einer solchen Partnerschaft
          bilden die Grundlage für die finanzielle Prüftung.
        </p>

        <RadioGroup
          name={schema.keyof().Values.partnerschaft}
          options={[
            {
              label: "Nein",
              value: YesNoAnswer.Enum.no,
            },
            {
              label: "Ja",
              value: YesNoAnswer.Enum.yes,
            },
          ]}
        />
      </div>
    );
  },
};
