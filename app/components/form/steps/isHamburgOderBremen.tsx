import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ isHamburgOderBremen: YesNoAnswer });

export const hamburgOderBremenStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Leben Sie in Hamburg oder Bremen?</h3>
        <p>
          Haben Sie einen Wohnsitz in Hamburg oder Bremnen, oder arbeiten Sie
          dort?
        </p>
        <RadioGroup
          name={schema.keyof().Values.isHamburgOderBremen}
          options={[
            { text: "Nein", value: YesNoAnswer.Enum.no },
            {
              text: "Ja, ich lebe in Hamburg oder Bremen",
              value: YesNoAnswer.Enum.yes,
            },
          ]}
        />
      </div>
    );
  },
};
