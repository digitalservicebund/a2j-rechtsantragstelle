import { z } from "zod";
import { integerSchema } from "~/services/validation/integer";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

export const abgabeContext = {
  abgabeArt: z.enum(["online", "ausdrucken"], customRequiredErrorMessage),
};

const fileUploadSchema = z.object({
  fileName: stringRequiredSchema,
  hash: stringRequiredSchema,
  size: integerSchema,
});

export const belegeContext = {
  belege: fileUploadSchema,
};
const _belegeContextObject = z.object(belegeContext).partial();
export type BelegeContext = z.infer<typeof _belegeContextObject>;

const _contextObject = z.object(abgabeContext).partial();
export type AbgabeContext = z.infer<typeof _contextObject>;
