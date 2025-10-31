import z from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
// import { stringOptionalSchema } from "~/services/validation/stringOptional";

export const berHAntragWeitereAngabenPages = {
  weitereAngaben: {
    stepId: "weitere-angaben",
    pageSchema: {
      weitereAngaben: schemaOrEmptyString(
        z.string().trim().max(TEXTAREA_CHAR_LIMIT, { message: "max" }),
      ),
    },
  },
} as const satisfies PagesConfig;
