import { isValidIBAN } from "ibantools";
import { z } from "zod";

export const ibanSchema = z
  .string()
  .toUpperCase()
  .transform((ibanInput) => {
    // .trim() won't remove the inbetween space
    // e.g. " LH 234 " becomes "LH 234"
    return ibanInput.split(" ").join("");
  })
  .refine(
    (ibanInput) => {
      return isValidIBAN(ibanInput);
    },
    {
      message: "invalid_iban_format",
    },
  );
