import { z } from "zod";
import { Input } from "~/components";
import { getRelevantInputContent } from "~/services/cms/getPageConfig";
import type { StepComponentProps } from "~/components/form/steps";

const schema = z.object({
  einkommenKinder: z.coerce.number().min(0, "min0"),
});

export const einkommenKinderStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const fieldName = schema.keyof().Values.einkommenKinder;
    const inputContent = getRelevantInputContent(content, fieldName);
    return (
      <Input
        name={fieldName}
        type={inputContent.type}
        label={inputContent.label}
        placeholder={inputContent.placeholder}
        suffix="€"
      />
    );
  },
};
