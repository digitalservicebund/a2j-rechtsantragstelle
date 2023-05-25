import { z } from "zod";
import { Input } from "~/components";
import { getRelevantInputContent } from "~/services/cms/getPageConfig";
import type { StepComponentProps } from "~/components/form/steps";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";

const schema = z.object({
  einkommenPartner: buildMoneyValidationSchema({ min: 0 }),
});

export const einkommenPartnerStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const fieldName = schema.keyof().Values.einkommenPartner;
    const inputContent = getRelevantInputContent(content, fieldName);
    return (
      <Input
        name={fieldName}
        type={inputContent.type}
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
