import type { StepInterface } from "../steps";
import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ hasSozialleistung: YesNoAnswer });

export const sozialleistungStep: StepInterface = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid green 1px", padding: "1rem" }}>
        <h2>Beziehst du Sozialleistungen?</h2>
        <p>...</p>
        <RadioGroup
          name={schema.keyof().Values.hasSozialleistung}
          options={[
            { label: "nein", value: YesNoAnswer.Enum.no },
            { label: "ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
