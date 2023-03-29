import { z } from "zod";
import { Input } from "~/components";
import type { StepComponentProps } from "~/components/form/steps";
import { getRelevantInputContent } from "~/services/cms/getPageConfig";

// TODO: Should this be the same income as einkommenSingle?
const schema = z.object({
  einkommenFamilie: z.coerce.number().min(0, "min0"),
});

export const einkommenFamilieStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const fieldName = schema.keyof().Values.einkommenFamilie;
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
