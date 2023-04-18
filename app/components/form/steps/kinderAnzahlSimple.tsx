import { z } from "zod";
import Input from "~/components/Input";
import type { StepComponentProps } from "~/components/form/steps";
import { getRelevantInputContent } from "~/services/cms/getPageConfig";

const schema = z.object({
  kidsTotal: z.coerce.number().min(0, "min0").default(0),
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
      />
    );
  },
};
