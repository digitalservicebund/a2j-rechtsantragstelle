import type { StepInterface } from "../steps";
import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ hasBeratungshilfeBeantragt: YesNoAnswer });

export const BeratungshilfeBeantragtStep: StepInterface = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>Beratungshilfe beantragt</h3>
        Hast du für diesen Fall schon einmal Beratungshilfe beantragt?
        <RadioGroup
          name={schema.keyof().Values.hasBeratungshilfeBeantragt}
          options={[
            { label: "nein", value: YesNoAnswer.Enum.no },
            { label: "ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
