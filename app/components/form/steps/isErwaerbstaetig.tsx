import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ isErwaerbstaetig: YesNoAnswer });

export const erwaerbstaetigStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Sind sie momentan erwärbstätig?</h3>
        <RadioGroup
          name={schema.keyof().Values.isErwaerbstaetig}
          options={[
            { label: "nein", value: YesNoAnswer.Enum.no },
            { label: "ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
