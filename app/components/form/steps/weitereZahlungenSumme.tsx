import { z } from "zod";
import { Input } from "~/components";
import type { StepComponentProps } from "~/components/form/steps";
import { getRelevantInputContent } from "~/services/cms/getPageConfig";
import { getInputProps } from "~/services/props/getInputProps";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";

const schema = z.object({
  weitereZahlungenSumme: buildMoneyValidationSchema({ min: 0 }),
});

export const weitereZahlungenSummeStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const fieldName = schema.keyof().Values.weitereZahlungenSumme;
    return (
      <Input
        {...getInputProps(getRelevantInputContent(content, fieldName))}
        name={fieldName}
        suffix="€"
      />
    );
  },
};
