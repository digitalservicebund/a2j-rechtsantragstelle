import { z } from "zod";
import { YesNoMaybeAnswer } from "~/services/validation/YesNoAnswer";
export const context = {
  basicinformationen: YesNoMaybeAnswer,
  unterhalt: YesNoMaybeAnswer,
} as const;

const _contextObject = z.object(context).partial();
export type schuldenZwangsvollstreckungContext = z.infer<typeof _contextObject>;
