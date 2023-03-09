import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ isErwaerbstaetig: YesNoAnswer });
const varNames = schema.keyof().Values;

export const erwaerbstaetigStep = {
  schema,
  varNames,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Sind sie momentan erwärbstätig?</h3>
        <RadioGroup
          name={varNames.isErwaerbstaetig}
          options={[
            { label: "nein", value: YesNoAnswer.Enum.no },
            { label: "ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
