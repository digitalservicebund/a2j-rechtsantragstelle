import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ partnerschaft: YesNoAnswer });
const varNames = schema.keyof().Values;

export const familienstandStep = {
  schema,
  varNames,
  component: () => {
    return (
      <div style={{ border: "solid green 1px", padding: "1rem" }}>
        <h2>
          Sind sie verheiratet oder sind Sie in einer eingetragenen
          Lebenspartnerschaft?
        </h2>

        <RadioGroup
          name={varNames.partnerschaft}
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
