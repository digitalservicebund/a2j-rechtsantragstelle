import { z } from "zod";
import { RadioGroup } from "~/components";
import type { StepComponentProps } from "~/components/form/steps";
import { getRelevantOptions } from "~/services/cms/getPageConfig";

export const staatlicheLeistungen = z.enum([
  "grundsicherung",
  "asylbewerberleistungen",
  "buergergeld",
  "keine",
]);
export type StaatlicheLeistungen = z.infer<typeof staatlicheLeistungen>;
const schema = z.object({ staatlicheLeistung: staatlicheLeistungen });

export const staatlicheLeistungenStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const fieldName = schema.keyof().Values.staatlicheLeistung;
    const options = getRelevantOptions(content, fieldName) ?? [];
    return <RadioGroup name={fieldName} options={options} />;
  },
};
