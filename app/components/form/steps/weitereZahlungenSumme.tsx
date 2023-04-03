import { z } from "zod";
import { Input } from "~/components";
import type { StepComponentProps } from "~/components/form/steps";
import { getRelevantInputContent } from "~/services/cms/getPageConfig";

const schema = z.object({
  weitereZahlungenSumme: z.coerce.number().min(0, "min0"),
});

export const weitereZahlungenSummeStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const fieldName = schema.keyof().Values.weitereZahlungenSumme;
    const inputContent = getRelevantInputContent(content, fieldName);
    return (
      <Input
        name={fieldName}
        type="number"
        step="any"
        label={inputContent.label}
      />
    );
  },
};
