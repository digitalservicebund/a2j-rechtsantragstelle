import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

export const berHAntragRechtsproblemPages = {
  bereich: {
    stepId: "rechtsproblem/bereich",
    pageSchema: {
      bereich: z.enum(
        [
          "authorities",
          "living",
          "work",
          "separation",
          "trade",
          "debt",
          "inheritance",
          "criminalProcedure",
          "other",
        ],
        customRequiredErrorMessage,
      ),
    },
  },
  situationBeschreibung: {
    stepId: "rechtsproblem/situation-beschreibung",
    pageSchema: {
      beschreibung: stringRequiredSchema,
    },
  },
  ziel: {
    stepId: "rechtsproblem/ziel",
    pageSchema: {
      ziel: stringRequiredSchema,
    },
  },
  eigeninitiativeBeschreibung: {
    stepId: "rechtsproblem/eigeninitiative-beschreibung",
    pageSchema: {
      eigeninitiativeBeschreibung: stringRequiredSchema,
    },
  },
  gegenseite: {
    stepId: "rechtsproblem/gegenseite",
    pageSchema: {
      gegenseite: stringRequiredSchema,
    },
  },
} as const satisfies PagesConfig;
