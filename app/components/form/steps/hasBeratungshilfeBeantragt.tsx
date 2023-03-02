import type { StepInterface } from "../steps";
import { z } from "zod";
import { Select } from "~/components";

export const BeratungshilfeBeantragtStep: StepInterface = {
  schema: z.object({
    hasBeratungshilfeBeantragt: z.coerce.boolean(),
  }),
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Beratungshilfe beantragt</h3>
        <Select
          name="hasBeratungshilfeBeantragt"
          label="Hast du für diesen Fall schon einmal Beratungshilfe beantragt?"
          options={[
            { text: "Nein", value: "" }, // empty string is the only falsy string
            { text: "Ja", value: "true" },
          ]}
        />
      </div>
    );
  },
};
