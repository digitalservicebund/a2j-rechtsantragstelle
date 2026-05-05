import z from "zod";
import { hiddenInputZodDescription } from "~/services/validation/hiddenInput";
import { ibanZodDescription } from "~/services/validation/iban";
import { filesUploadZodDescription } from "~/services/validation/pdfFileSchema";

const specialComponentDescriptions = [
  filesUploadZodDescription,
  hiddenInputZodDescription,
  ibanZodDescription,
] as const;

export type SpecialComponentDescription =
  (typeof specialComponentDescriptions)[number];

export const extractZodDescription = (schema: z.ZodType) => {
  let nestedDescription: string | undefined;
  if (schema instanceof z.ZodUnion) {
    nestedDescription = schema.options
      .map((innerSchema) => (innerSchema as z.ZodType).description)
      .find(Boolean);
  }
  if (schema instanceof z.ZodPipe) {
    nestedDescription =
      (schema.out as z.ZodType).description ??
      (schema.in as z.ZodType).description;
  }
  return schema.description ?? nestedDescription;
};

export const isSpecialComponentDescriptions = (
  val?: any,
): val is SpecialComponentDescription =>
  specialComponentDescriptions.includes(val);
