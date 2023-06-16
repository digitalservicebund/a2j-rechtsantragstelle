import { z } from "zod";
import { Input } from "~/components";
import { getRelevantInputContent } from "~/services/cms/getPageConfig";
import type { StepComponentProps } from "~/components/form/steps";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { getInputProps } from "~/services/props/getInputProps";

const schema = z.object({
  einkommenKinder: buildMoneyValidationSchema({ min: 0 }),
});

export const einkommenKinderStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const inputName = schema.keyof().Values.einkommenKinder;
    return (
      <Input
        {...getInputProps(getRelevantInputContent({ inputName, content }))}
        name={inputName}
      />
    );
  },
};
