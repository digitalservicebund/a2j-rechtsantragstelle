import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ wurdeVerklagt: YesNoAnswer });
const varNames = schema.keyof().Values;

export const wurdeVerklagtStep = {
  schema,
  varNames,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Wurden Sie Verklagt?</h3>
        Klagen werden immer in diesem gelben Umschlägen verschickt: INSERT BILD
        <RadioGroup
          name={varNames.wurdeVerklagt}
          options={[
            { label: "nein", value: YesNoAnswer.Enum.no },
            { label: "ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
