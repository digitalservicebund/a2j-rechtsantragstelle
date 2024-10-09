import { isValidIBAN } from "ibantools";
import { z } from "zod";

export const ibanSchema = z
  .string()
  .transform((ibanInput) => ibanInput.replaceAll(" ", ""))
  .refine(isValidIBAN, {
    message: "invalid_iban_format",
  });
