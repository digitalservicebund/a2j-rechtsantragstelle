import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ wurdeVerklagt: YesNoAnswer });

export const wurdeVerklagtStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Wurden Sie Verklagt?</h3>
        Klagen werden immer in diesem gelben Umschlägen verschickt: INSERT BILD
        <RadioGroup
          name={schema.keyof().Values.wurdeVerklagt}
          options={[
            { label: "Nein", value: YesNoAnswer.Enum.no },
            { label: "Ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
