import type { StepInterface } from "../steps";
import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ isHamburgOderBremen: YesNoAnswer });

export const HamburgOderBremenStep: StepInterface = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Wohnort</h3>
        <p>Wohnst du in Hamburg oder Bremen?</p>
        <RadioGroup
          name={schema.keyof().Values.isHamburgOderBremen}
          options={[
            { label: "nein", value: YesNoAnswer.Enum.no },
            { label: "ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
