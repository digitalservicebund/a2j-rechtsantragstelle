import z from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { finanzielleAngabenPartnerPages } from "~/domains/shared/formular/finanzielleAngaben/partner/pages";
import {
  besondereBelastungenInputSchema,
  bankkontenArraySchema,
  geldanlagenArraySchema,
  grundeigentumArraySchema,
  kinderArraySchema,
  kraftfahrzeugeArraySchema,
  unterhaltszahlungInputSchema,
  wertsachenArraySchema,
  financialEntryInputSchema,
  livingSituationInputSchema,
} from "~/domains/shared/formular/finanzielleAngaben/userData";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

export const pkhFormularFinanzielleAngabenPages = {
  eigentum: {
    stepId: "finanzielle-angaben/eigentum",
  },
  eigentumInfo: {
    stepId: "finanzielle-angaben/eigentum-info",
  },
  eigentumKraftfahrzeugeFrage: {
    stepId: "finanzielle-angaben/eigentum-kraftfahrzeuge-frage",
  },
  eigentumKraftfahrzeuge: {
    stepId: "finanzielle-angaben/eigentum-kraftfahrzeuge",
  },
  eigentumKraftfahrzeugeInfo: {
    stepId: "finanzielle-angaben/eigentum-kraftfahrzeuge-info",
  },
  eigentumZusammenfassung: {
    stepId: "finanzielle-angaben/eigentum-zusammenfassung",
    pageSchema: {
      bankkonten: bankkontenArraySchema,
      geldanlagen: geldanlagenArraySchema,
      grundeigentum: grundeigentumArraySchema,
      kinder: kinderArraySchema,
      kraftfahrzeuge: kraftfahrzeugeArraySchema,
      wertsachen: wertsachenArraySchema,
      unterhaltszahlungen: unterhaltszahlungInputSchema,
      financialEntries: financialEntryInputSchema,
    },
    arrayPages: {
      geldanlagen: {
        stepId: "geldanlagen",
        pageSchema: {
          geldanlagen: geldanlagenArraySchema,
        },
        arrayPages: {
          art: {
            stepId: "art",
            pageSchema: {
              art: z.enum(
                [
                  "bargeld",
                  "wertpapiere",
                  "guthabenkontoKrypto",
                  "giroTagesgeldSparkonto",
                  "befristet",
                  "forderung",
                  "sonstiges",
                ],
                customRequiredErrorMessage,
              ),
            },
          },
          bargeld: {
            stepId: "bargeld",
            pageSchema: {
              bargeld: z.enum(
                [
                  "bargeld",
                  "wertpapiere",
                  "guthabenkontoKrypto",
                  "giroTagesgeldSparkonto",
                  "befristet",
                  "forderung",
                  "sonstiges",
                ],
                customRequiredErrorMessage,
              ),
            },
          },
        },
      },
    },
  },
  ...finanzielleAngabenPartnerPages,
} as const satisfies PagesConfig;
