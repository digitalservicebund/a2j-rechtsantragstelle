import { z } from "zod";
import type { StepComponentProps } from "~/components/form/steps";
import RadioGroupWithContent from "~/components/RadioGroupWithContent";

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
    return <RadioGroupWithContent name={fieldName} content={content} />;
  },
};
