import { z } from "zod";
import type {
  FormComponentCMS,
  Select,
} from "~/services/cms/models/formComponents";
import RadioGroup from "../RadioGroup";

export const YesNoAnswer = z.enum(["yes", "no"]);
export type YesNoAnswerType = z.infer<typeof YesNoAnswer>;
export const defaultYesNoOptions = [
  { value: YesNoAnswer.enum.no, text: "Nein" },
  { value: YesNoAnswer.enum.yes, text: "Ja" },
];

export function yesNoOptions(
  content: FormComponentCMS[] = [],
  fieldname: string
) {
  const matchingSelectElements = content.filter(
    (e) => e.name === fieldname && e.__component === "form-elements.select"
  ) as Select[];
  return matchingSelectElements.length
    ? matchingSelectElements[0]["options"]
    : defaultYesNoOptions;
}

export function yesNoRadioGroup(
  content: FormComponentCMS[] = [],
  schema: z.AnyZodObject
) {
  const fieldname = schema.keyof()._def.values[0] as string;
  return (
    <RadioGroup name={fieldname} options={yesNoOptions(content, fieldname)} />
  );
}
