import isIBAN from "validator/lib/isIBAN";
import { z } from "zod";

// @ts-expect-error 'validator' is using non-standard ESM exports, which forces us to unpack one nested "default" property in Node
const isIbanCheck: typeof isIBAN = isIBAN.default ?? isIBAN;

export const ibanZodDescription = "iban";

export type ZodIban = typeof ibanSchema;

export const ibanSchema = z
  .codec(z.string(), z.string(), {
    decode: (iban) => iban.replaceAll(" ", "").toLocaleUpperCase(),
    encode: (iban) => formatIban(iban),
  })
  .refine(isIbanCheck, { message: "invalid_iban_format" })
  .describe(ibanZodDescription);

export function formatIban(iban: string) {
  const splitIban = iban
    .replaceAll(" ", "")
    .toLocaleUpperCase()
    .match(/.{1,4}/g);
  const formattedIban = splitIban?.join(" ") ?? "";
  return formattedIban;
}
