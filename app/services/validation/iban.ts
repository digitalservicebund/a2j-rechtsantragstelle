import { isValidIBAN } from "ibantools";
import { z } from "zod";

export const ibanSchema = z
  .string()
  .transform((ibanInput) => {
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
