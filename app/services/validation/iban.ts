import isIBAN from "validator/lib/isIBAN";
import { z, type ZodString } from "zod";

// @ts-expect-error 'validator' is using non-standard ESM exports, which forces us to unpack one nested "default" property in Node
const isIbanCheck = isIBAN.default ?? isIBAN;

export const ibanSchema: ZodString = z
  .string()
  .toUpperCase()
  .transform((ibanInput) => ibanInput.replaceAll(" ", ""))
  .refine(isIbanCheck, { message: "invalid_iban_format" });
