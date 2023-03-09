import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ hasBeratungshilfeBeantragt: YesNoAnswer });
const varNames = schema.keyof().Values;
export const beratungshilfeBeantragtStep = {
  schema,
  varNames,
  component: () => {
    return (
      <div style={{ border: "solid black 1px", padding: "1rem" }}>
        <h3>
          Haben Sie in der Vergangenheit schon mal Beratungshilfe in dieser
          Angelegenheit beantragt?
        </h3>
        <RadioGroup
          name={varNames.hasBeratungshilfeBeantragt}
          options={[
            { label: "nein", value: YesNoAnswer.Enum.no },
            { label: "ja", value: YesNoAnswer.Enum.yes },
          ]}
        />
      </div>
    );
  },
};
