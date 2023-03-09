import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ isHamburgOderBremen: YesNoAnswer });
const varNames = schema.keyof().Values;

export const hamburgOderBremenStep = {
  schema,
  varNames,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Leben Sie in Hamburg oder Bremen?</h3>
        <RadioGroup
          name={varNames.isHamburgOderBremen}
          options={[
            { label: "nein", value: YesNoAnswer.Enum.no },
            { label: "ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
