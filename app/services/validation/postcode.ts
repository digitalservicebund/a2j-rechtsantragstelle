import { z } from "zod";
import { validPostcodes } from "data/validPostcodes.server";
import { serverOnly } from "../serverOnly";

function isValidPostcode(postcode: string) {
  const postcodeNum = parseInt(postcode, 10);
  return postcodeNum >= 1067 && postcodeNum <= 99998 && /\d{5}/.test(postcode);
}

const serverValidation = serverOnly((postcode: string) =>
  validPostcodes.has(postcode),
);

export const postcodeSchema = z
  .string()
  .trim()
  .length(5, { message: "length" })
  .refine((postcode) => isValidPostcode(postcode), { message: "invalid" })
  .refine(
    (postcode) => serverValidation === undefined || serverValidation(postcode),
    { message: "notFound" },
  );
