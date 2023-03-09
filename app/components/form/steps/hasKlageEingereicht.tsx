import type { StepInterface } from "../steps";
import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ hasKlageEingereicht: YesNoAnswer });

export const klageEingereichtStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Klage eingereicht</h3>
        Wurde zu diesem Fall bereits Klage eingereicht?
        <RadioGroup
          name={schema.keyof().Values.hasKlageEingereicht}
          options={[
            { label: "nein", value: YesNoAnswer.Enum.no },
            { label: "ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
