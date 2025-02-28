import { z } from "zod";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";
import { fileMetaDataSchema } from "~/util/file/pdfFileSchema";

export const abgabeContext = {
  abgabeArt: z.enum(["online", "ausdrucken"], customRequiredErrorMessage),
};

export const belegeContext = {
  belege: z.array(fileMetaDataSchema).max(5),
  belege1: z.array(fileMetaDataSchema).max(5),
  // belege: pdfFileSchema,
  // belege1: pdfFileSchema,
};
export const _belegeContextObject = z.object(belegeContext).partial();
export type BelegeContext = z.infer<typeof _belegeContextObject>;

const _contextObject = z.object(abgabeContext).partial();
export type AbgabeContext = z.infer<typeof _contextObject>;
