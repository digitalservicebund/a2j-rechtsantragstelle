import { z } from "zod";
import Input from "~/components/Input";
import type { StepComponentProps } from "~/components/form/steps";
import { getRelevantInputContent } from "~/services/cms/getPageConfig";
import { getInputProps } from "~/services/props/getInputProps";
import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";

const schema = z.object({
  kidsTotal: buildKidsCountValidationSchema(),
});

export const kinderAnzahlSimpleStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const fieldName = schema.keyof().Values.kidsTotal;
    return (
      <Input
        {...getInputProps(getRelevantInputContent(content, fieldName))}
        name={fieldName}
      />
    );
  },
};
