import { z } from "zod";
import { Input } from "~/components";
import type { StepComponentProps } from "~/components/form/steps";
import { getRelevantInputContent } from "~/services/cms/getPageConfig";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";

const schema = z.object({
  unterhalt: buildMoneyValidationSchema({ min: 0 }),
});

export const unterhaltSummeStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const fieldName = schema.keyof().Values.unterhalt;
    const inputContent = getRelevantInputContent(content, fieldName);
    return (
      <Input
        name={fieldName}
        type="number"
        step="any"
        label={inputContent.label}
        placeholder={
          inputContent.placeholder ? inputContent.placeholder : undefined
        }
        suffix="€"
        errors={inputContent.errors.data}
      />
    );
  },
};
