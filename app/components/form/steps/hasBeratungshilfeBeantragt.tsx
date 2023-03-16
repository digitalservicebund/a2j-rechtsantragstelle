import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ hasBeratungshilfeBeantragt: YesNoAnswer });

export const beratungshilfeBeantragtStep = {
  schema,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>
          Haben Sie in der Vergangenheit schon mal Beratungshilfe in dieser
          Angelegenheit beantragt?
        </h3>
        <RadioGroup
          name={schema.keyof().Values.hasBeratungshilfeBeantragt}
          options={[
            { label: "Nein", value: YesNoAnswer.Enum.no },
            { label: "Ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
