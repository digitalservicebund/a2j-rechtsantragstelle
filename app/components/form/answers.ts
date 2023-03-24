import { z } from "zod";
export const YesNoAnswer = z.enum(["yes", "no"]);
export type YesNoAnswerType = z.infer<typeof YesNoAnswer>;
export const defaultYesNoOptions = [
  { value: YesNoAnswer.enum.no, text: "Nein" },
  { value: YesNoAnswer.enum.yes, text: "Ja" },
];
