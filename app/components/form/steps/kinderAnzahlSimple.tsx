import { z } from "zod";
import Input from "~/components/Input";
import type { StepComponentProps } from "~/components/form/steps";
import { getRelevantInputContent } from "~/services/cms/getPageConfig";
import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";

const schema = z.object({
  kidsTotal: buildKidsCountValidationSchema(),
});

export const kinderAnzahlSimpleStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const fieldName = schema.keyof().Values.kidsTotal;
    const inputContent = getRelevantInputContent(content, fieldName);
    return (
      <Input
        name={fieldName}
        type={inputContent.type}
        label={inputContent.label}
        placeholder={
          inputContent.placeholder ? inputContent.placeholder : undefined
        }
        errors={inputContent.errors.data}
      />
    );
  },
};
