import { type PagesConfig } from "~/domains/pageSchemas";
import { stringOptionalSchema } from "~/services/validation/stringOptional";

export const pkhFormularWeitereAngabenPages = {
  weitereAngaben: {
    stepId: "weitere-angaben",
    pageSchema: {
      weitereAngaben: stringOptionalSchema,
    },
  },
} as const satisfies PagesConfig;
