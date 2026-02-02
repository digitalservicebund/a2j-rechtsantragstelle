import isIBAN from "validator/lib/isIBAN";
import { z } from "zod";

// @ts-expect-error 'validator' is using non-standard ESM exports, which forces us to unpack one nested "default" property in Node
const isIbanCheck: typeof isIBAN = isIBAN.default ?? isIBAN;

export const ibanSchema = z
  .string()
  .toUpperCase()
  .transform((ibanInput) => ibanInput.replaceAll(" ", ""))
  .refine(isIbanCheck, { message: "invalid_iban_format" });

export function formatIban(iban: string) {
  const splitIban = iban
    .replaceAll(" ", "")
    .toLocaleUpperCase()
    .match(/.{1,4}/g);
  const formattedIban = splitIban?.join(" ") ?? "";
  return formattedIban;
}
