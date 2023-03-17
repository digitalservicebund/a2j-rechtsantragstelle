import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ isErwaerbstaetig: YesNoAnswer });

export const erwaerbstaetigStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Sind sie momentan erwerbstätig?</h3>
        <p>Als Erwerbstätigkeit zählen Arbeiten, ....</p>
        <RadioGroup
          name={schema.keyof().Values.isErwaerbstaetig}
          options={[
            { label: "Nein", value: YesNoAnswer.Enum.no },
            { label: "Ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
