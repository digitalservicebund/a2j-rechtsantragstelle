import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

export const berHAntragRechtsproblemPages = {
  bereich: {
    stepId: "rechtsproblem/bereich",
    pageSchema: {
      bereich: z.enum([
        "authorities",
        "living",
        "work",
        "separation",
        "trade",
        "debt",
        "inheritance",
        "criminalProcedure",
        "other",
      ]),
    },
  },
  situationBeschreibung: {
    stepId: "rechtsproblem/situation-beschreibung",
    pageSchema: {
      gegenseite: stringRequiredSchema,
      beschreibung: stringRequiredSchema,
      ziel: stringRequiredSchema,
      eigeninitiativeBeschreibung: stringRequiredSchema,
    },
  },
} as const satisfies PagesConfig;
