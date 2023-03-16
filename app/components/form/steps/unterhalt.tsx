import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ isPayingUnterhalt: YesNoAnswer });

export const unterhaltStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Zahlen Sie darüber hinaus noch für jemanden Unterhalt?</h3>
        <p>
          Zahlen Sie z.B. für Kinder, die nicht bei Ihnen leben, Ex-Partner oder
          andere Angehörige Unterhalt?
        </p>
        <RadioGroup
          name={schema.keyof().Values.isPayingUnterhalt}
          options={[
            { label: "Nein", value: YesNoAnswer.Enum.no },
            { label: "Ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
