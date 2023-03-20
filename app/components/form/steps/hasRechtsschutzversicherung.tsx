import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";

const schema = z.object({ hasRechtsschutzversicherung: YesNoAnswer });

export const rechtsschutzversicherungStep = {
  schema,
  component: () => {
    return (
      <RadioGroup
        name={schema.keyof().Values.hasRechtsschutzversicherung}
        options={[
          { label: "Nein", value: YesNoAnswer.enum.no },
          { label: "Ja", value: YesNoAnswer.enum.yes },
        ]}
      />
    );
  },
};
