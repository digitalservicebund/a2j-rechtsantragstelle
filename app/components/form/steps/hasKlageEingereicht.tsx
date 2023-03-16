import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ hasKlageEingereicht: YesNoAnswer });

export const klageEingereichtStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Haben Sie selbst eine Klage eingereicht?</h3>
        <RadioGroup
          name={schema.keyof().Values.hasKlageEingereicht}
          options={[
            { label: "Nein", value: YesNoAnswer.Enum.no },
            { label: "Ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
