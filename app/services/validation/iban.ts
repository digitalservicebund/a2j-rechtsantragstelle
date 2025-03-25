import isIBAN from "validator/lib/isIBAN";
import { z } from "zod";

export const ibanSchema = z
  .string()
  .toUpperCase()
  .transform((ibanInput) => ibanInput.replaceAll(" ", ""))
  .refine(isIBAN, { message: "invalid_iban_format" });
