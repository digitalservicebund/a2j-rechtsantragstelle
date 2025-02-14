import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
export const context = {
  zwangsvollstreckung: YesNoAnswer,
} as const;

const _contextObject = z.object(context).partial();
export type schuldenZwangsvollstreckungContext = z.infer<typeof _contextObject>;
