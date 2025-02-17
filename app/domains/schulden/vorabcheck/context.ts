import { z } from "zod";
import { YesNoMaybeAnswer } from "~/services/validation/YesNoAnswer";
export const context = {
  basicinformationen: YesNoMaybeAnswer,
} as const;

const _contextObject = z.object(context).partial();
export type kontopfaendungWegweiserContext = z.infer<typeof _contextObject>;
