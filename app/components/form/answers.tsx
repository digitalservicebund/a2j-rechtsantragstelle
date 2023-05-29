import { z } from "zod";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import RadioGroupWithContent from "~/components/RadioGroupWithContent";

export const YesNoAnswer = z.enum(["yes", "no"]);
export type YesNoAnswerType = z.infer<typeof YesNoAnswer>;
export const defaultYesNoOptions = [
  { value: YesNoAnswer.enum.no, text: "Nein" },
  { value: YesNoAnswer.enum.yes, text: "Ja" },
];

export function yesNoRadioGroup(
  content: StrapiFormComponent[] = [],
  schema: z.AnyZodObject
) {
  const fieldname = schema.keyof()._def.values[0] as string;
  return (
    <RadioGroupWithContent
      name={fieldname}
      content={content}
      defaultOptions={defaultYesNoOptions}
    />
  );
}
