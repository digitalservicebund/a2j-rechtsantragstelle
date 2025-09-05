import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { financialEntryInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const pkhFormularFinanzielleAngabenAbzuegePages = {
  arbeitsweg: {
    stepId: "finanzielle-angaben/abzuege/arbeitsweg",
    pageSchema: {
      arbeitsweg: z.enum([
        "publicTransport",
        "privateVehicle",
        "bike",
        "walking",
        "none",
      ]),
    },
  },
  opnvKosten: {
    stepId: "finanzielle-angaben/abzuege/opnv-kosten",
    pageSchema: {
      monatlicheOPNVKosten: buildMoneyValidationSchema(),
    },
  },
  arbeitsplatzEntfernung: {
    stepId: "finanzielle-angaben/abzuege/arbeitsplatz-entfernung",
    pageSchema: {
      arbeitsplatz: z.object({
        strasseHausnummer: stringRequiredSchema,
        plz: stringOptionalSchema,
        ort: stringRequiredSchema,
        land: stringOptionalSchema,
      }),
      arbeitsplatzEntfernung: integerSchema.refine((distance) => distance > 0, {
        message: "invalidInteger",
      }),
    },
  },
  arbeitswegKeineRolle: {
    stepId: "finanzielle-angaben/abzuege/keine-rolle",
  },
  arbeitsausgaben: {
    stepId: "finanzielle-angaben/abzuege/arbeitsausgaben",
    pageSchema: {
      arbeitsausgaben: z.array(financialEntryInputSchema),
    },
    arrayPages: {
      daten: {
        pageSchema: {
          "arbeitsausgaben#beschreibung": stringRequiredSchema,
          "arbeitsausgaben#zahlungsfrequenz": z.enum([
            "monthly",
            "quarterly",
            "yearly",
            "one-time",
          ]),
          "arbeitsausgaben#betrag": buildMoneyValidationSchema(),
        },
      },
    },
  },
  arbeitsausgabenFrage: {
    stepId: "finanzielle-angaben/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
    pageSchema: {
      hasArbeitsausgaben: YesNoAnswer,
    },
  },
  arbeitsausgabenUebersicht: {
    stepId: "finanzielle-angaben/abzuege/arbeitsausgaben/uebersicht",
  },
  arbeitsausgabenWarnung: {
    stepId: "finanzielle-angaben/abzuege/arbeitsausgaben/warnung",
  },
} as const satisfies PagesConfig;
