import { z } from "zod";
import { RadioGroup } from "~/components";
import { YesNoAnswer } from "../answers";
import type { StepComponentProps } from "~/components/form/steps";

const schema = z.object({ hasRechtsschutzversicherung: YesNoAnswer });

export const rechtsschutzversicherungStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    return (
      <RadioGroup
        name={schema.keyof().Values.hasRechtsschutzversicherung}
        options={[
          { value: YesNoAnswer.enum.no },
          { value: YesNoAnswer.enum.yes },
        ]}
        pageContent={content}
      />
    );
  },
};
