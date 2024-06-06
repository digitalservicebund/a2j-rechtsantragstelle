import { serverOnly$ } from "vite-env-only/macros";
import { z } from "zod";
import { courtForPlz } from "../gerichtsfinder/amtsgerichtData.server";

function isValidPostcode(postcode: string) {
  const postcodeNum = parseInt(postcode, 10);
  return postcodeNum >= 1067 && postcodeNum <= 99998 && /\d{5}/.test(postcode);
}

const serverValidation = serverOnly$(
  (postcode: string) => courtForPlz(postcode) !== undefined,
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
