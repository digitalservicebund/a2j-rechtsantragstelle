import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { besondereBelastungenInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { createDateSchema } from "~/services/validation/date";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { today } from "~/util/date";

const zahlungspflichtigerSchema = z.enum([
  "myself",
  "myselfAndPartner",
  "myselfAndSomeoneElse",
]);

const versicherungenArtSchema = z.enum([
  "haftpflichtversicherung",
  "hausratsversicherung",
  "unfallversicherung",
  "privateKrankenzusatzversicherung",
  "kfzVersicherung",
  "sonstige",
]);

export const versicherungenArraySchema = z.array(
  z.union([
    z.object({
      art: z.enum([
        ...versicherungenArtSchema.options.filter((art) => art !== "sonstige"),
      ]),
      beitrag: buildMoneyValidationSchema(),
    }),
    z.object({
      art: z.literal(versicherungenArtSchema.enum.sonstige),
      beitrag: buildMoneyValidationSchema(),
      sonstigeArt: stringRequiredSchema,
    }),
  ]),
);

export const pkhFormularFinanzielleAngabenAusgabenPages = {
  ausgabenFrage: {
    stepId: "finanzielle-angaben/ausgaben/ausgaben-frage",
    pageSchema: {
      hasAusgaben: YesNoAnswer,
    },
  },
  ausgabenZusammenfassung: {
    stepId: "finanzielle-angaben/ausgaben/zusammenfassung",
  },
  ausgabenVersicherungen: {
    stepId: "finanzielle-angaben/ausgaben/versicherungen",
    pageSchema: {
      versicherungen: versicherungenArraySchema,
    },
    arrayPages: {
      daten: {
        pageSchema: {
          "versicherungen#art": versicherungenArtSchema,
          "versicherungen#beitrag": buildMoneyValidationSchema(),
        },
      },
      "sonstige-art": {
        pageSchema: { "versicherungen#sonstigeArt": stringRequiredSchema },
      },
    },
  },
  ausgabenRatenzahlungen: {
    stepId: "finanzielle-angaben/ausgaben/ratenzahlungen",
    pageSchema: {
      ratenzahlungen: z.array(
        z
          .object({
            art: stringRequiredSchema,
            zahlungsempfaenger: stringRequiredSchema,
            zahlungspflichtiger: zahlungspflichtigerSchema,
            betragEigenerAnteil: buildMoneyValidationSchema().optional(),
            betragGesamt: buildMoneyValidationSchema(),
            restschuld: buildMoneyValidationSchema(),
            laufzeitende: createDateSchema({
              earliest: () => today(),
            }),
          })
          .partial(),
      ),
    },
    arrayPages: {
      daten: {
        pageSchema: {
          "ratenzahlungen#art": stringRequiredSchema,
          "ratenzahlungen#zahlungsempfaenger": stringRequiredSchema,
        },
      },
      zahlungspflichtiger: {
        pageSchema: {
          "ratenzahlungen#zahlungspflichtiger": zahlungspflichtigerSchema,
        },
      },
      betragGemeinsamerAnteil: {
        pageSchema: {
          "ratenzahlungen#betragGesamt": buildMoneyValidationSchema(),
        },
      },
      betragEigenerAnteil: {
        pageSchema: {
          "ratenzahlungen#betragEigenerAnteil": buildMoneyValidationSchema(),
        },
      },
      betragGesamt: {
        pageSchema: {
          "ratenzahlungen#betragGesamt": buildMoneyValidationSchema(),
        },
      },
      restschuld: {
        pageSchema: {
          "ratenzahlungen#restschuld": buildMoneyValidationSchema(),
        },
      },
      laufzeitende: {
        pageSchema: {
          "ratenzahlungen#laufzeitende": stringRequiredSchema,
        },
      },
    },
  },
  ausgabenSonstigeAusgaben: {
    stepId: "finanzielle-angaben/ausgaben/sonstigeAusgaben",
    pageSchema: {
      sonstigeAusgaben: z.array(
        z
          .object({
            art: stringRequiredSchema,
            zahlungsempfaenger: stringRequiredSchema,
            zahlungspflichtiger: zahlungspflichtigerSchema,
            betragEigenerAnteil: buildMoneyValidationSchema().optional(),
            betragGesamt: buildMoneyValidationSchema(),
          })
          .partial(),
      ),
    },
    arrayPages: {
      daten: {
        pageSchema: {
          "sonstigeAusgaben#art": stringRequiredSchema,
          "sonstigeAusgaben#zahlungsempfaenger": stringRequiredSchema,
        },
      },
      zahlungspflichtiger: {
        pageSchema: {
          "sonstigeAusgaben#zahlungspflichtiger": zahlungspflichtigerSchema,
        },
      },
      betragGemeinsamerAnteil: {
        pageSchema: {
          "sonstigeAusgaben#betragGesamt": buildMoneyValidationSchema(),
        },
      },
      betragEigenerAnteil: {
        pageSchema: {
          "sonstigeAusgaben#betragEigenerAnteil": buildMoneyValidationSchema(),
        },
      },
      betragGesamt: {
        pageSchema: {
          "sonstigeAusgaben#betragGesamt": buildMoneyValidationSchema(),
        },
      },
    },
  },
  ausgabenBesondereBelastungen: {
    stepId: "finanzielle-angaben/ausgaben/besondere-belastungen",
    pageSchema: {
      besondereBelastungen: besondereBelastungenInputSchema,
    },
  },
} as const satisfies PagesConfig;
