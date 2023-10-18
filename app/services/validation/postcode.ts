import { z } from "zod";

function isValidPostcode(postcode: string) {
  const postcodeNum = parseInt(postcode, 10);
  return postcodeNum >= 1067 && postcodeNum <= 99998;
}

export const postcodeSchema = z
  .string()
  .trim()
  .length(5, { message: "length" })
  .refine((postcode) => isValidPostcode(postcode), { message: "invalid" });
