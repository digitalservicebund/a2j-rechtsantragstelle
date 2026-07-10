import { type PagesConfig } from "~/domains/pageSchemas";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

export const antragstellendePersonPages = {
  antragstellendePersonName: {
    stepId: "/antragstellende-person/name",
    pageSchema: {
      antragstellendePersonVorname: stringRequiredSchema,
      antragstellendePersonNachname: stringRequiredSchema,
      antragstellendePersonGeburtsname: stringOptionalSchema,
    },
  },
} satisfies PagesConfig;
