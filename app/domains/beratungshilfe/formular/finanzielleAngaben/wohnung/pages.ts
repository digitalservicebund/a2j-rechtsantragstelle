import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";

export const berhAntragFinanzielleAngabenWohnungPages = {
  wohnsituation: {
    stepId: "finanzielle-angaben/wohnung/wohnsituation",
    pageSchema: {
      livingSituation: z.enum(["alone", "withRelatives", "withOthers"]),
    },
  },
  wohnungGroesse: {
    stepId: "finanzielle-angaben/wohnung/groesse",
    pageSchema: {
      apartmentSizeSqm: integerSchema,
    },
  },
  wohnkostenAllein: {
    stepId: "finanzielle-angaben/wohnung/wohnkosten-allein",
    pageSchema: {
      apartmentCostAlone: buildMoneyValidationSchema(),
    },
  },
  personenAnzahl: {
    stepId: "finanzielle-angaben/wohnung/personen-anzahl",
    pageSchema: {
      apartmentPersonCount: integerSchema,
    },
  },
  wohnkostenGeteilt: {
    stepId: "finanzielle-angaben/wohnung/wohnkosten-geteilt",
    pageSchema: {
      apartmentCostFull: buildMoneyValidationSchema(),
      apartmentCostOwnShare: buildMoneyValidationSchema(),
    },
  },
} as const satisfies PagesConfig;
