import { serverOnly$ } from "vite-env-only/macros";
import { z } from "zod";
import { validPostcodes } from "data/validPostcodes.server";

function isValidPostcode(postcode: string) {
  const postcodeNum = parseInt(postcode, 10);
  return postcodeNum >= 1067 && postcodeNum <= 99998 && /\d{5}/.test(postcode);
}

// The unusual "import.meta.env &&" logic is used to allow tsx scripts to consume serverOnly$() without running vite, see https://github.com/pcattori/vite-env-only/issues/19
// At the time of writing, 'scripts/unusedStrapiEntries.ts' imports { flows } from "~/domains/flows.server", which then pulls in the schema below
const serverValidation =
  import.meta.env &&
  serverOnly$((postcode: string) => validPostcodes.has(postcode));

export const postcodeSchema = z
  .string()
  .trim()
  .length(5, { message: "length" })
  .refine((postcode) => isValidPostcode(postcode), { message: "invalid" })
  .refine(
    (postcode) => serverValidation === undefined || serverValidation(postcode),
    { message: "notFound" },
  );
