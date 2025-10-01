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

const betragEigenerAnteilSchema = buildMoneyValidationSchema();

const sharedRatenZahlungFields = {
  art: stringRequiredSchema,
  zahlungsempfaenger: stringRequiredSchema,
  betragGesamt: buildMoneyValidationSchema(),
  restschuld: buildMoneyValidationSchema(),
  laufzeitende: createDateSchema({ earliest: () => today() }),
};

export const ratenZahlungArraySchema = z.array(
  z.union([
    z.object({
      ...sharedRatenZahlungFields,
      zahlungspflichtiger: z.literal("myself"),
    }),
    z.object({
      ...sharedRatenZahlungFields,
      betragEigenerAnteil: betragEigenerAnteilSchema,
      zahlungspflichtiger: z
        .literal("myselfAndPartner")
        .or(z.literal("myselfAndSomeoneElse")),
    }),
  ]),
);

const sharedSonstigeZahlungFields = {
  art: stringRequiredSchema,
  zahlungsempfaenger: stringRequiredSchema,
  betragGesamt: buildMoneyValidationSchema(),
};

export const sonstigeZahlungArraySchema = z.array(
  z.union([
    z.object({
      ...sharedSonstigeZahlungFields,
      zahlungspflichtiger: z.literal("myself"),
    }),
    z.object({
      ...sharedSonstigeZahlungFields,
      betragEigenerAnteil: betragEigenerAnteilSchema,
      zahlungspflichtiger: z
        .literal("myselfAndPartner")
        .or(z.literal("myselfAndSomeoneElse")),
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
          "versicherungen#beitrag":
            versicherungenArraySchema.element.def.options[0].shape.beitrag,
        },
      },
      "sonstige-art": {
        pageSchema: {
          "versicherungen#sonstigeArt":
            versicherungenArraySchema.element.def.options[1].shape.sonstigeArt,
        },
      },
    },
  },
  ausgabenRatenzahlungen: {
    stepId: "finanzielle-angaben/ausgaben/ratenzahlungen",
    pageSchema: { ratenzahlungen: ratenZahlungArraySchema },
    arrayPages: {
      daten: {
        pageSchema: {
          "ratenzahlungen#art": sharedRatenZahlungFields.art,
          "ratenzahlungen#zahlungsempfaenger":
            sharedRatenZahlungFields.zahlungsempfaenger,
        },
      },
      zahlungspflichtiger: {
        pageSchema: {
          "ratenzahlungen#zahlungspflichtiger": zahlungspflichtigerSchema,
        },
      },
      betragGemeinsamerAnteil: {
        pageSchema: {
          "ratenzahlungen#betragGesamt": sharedRatenZahlungFields.betragGesamt,
        },
      },
      betragEigenerAnteil: {
        pageSchema: {
          "ratenzahlungen#betragEigenerAnteil": betragEigenerAnteilSchema,
        },
      },
      betragGesamt: {
        pageSchema: {
          "ratenzahlungen#betragGesamt": sharedRatenZahlungFields.betragGesamt,
        },
      },
      restschuld: {
        pageSchema: {
          "ratenzahlungen#restschuld": sharedRatenZahlungFields.restschuld,
        },
      },
      laufzeitende: {
        pageSchema: {
          "ratenzahlungen#laufzeitende": sharedRatenZahlungFields.laufzeitende,
        },
      },
    },
  },
  ausgabenSonstigeAusgaben: {
    stepId: "finanzielle-angaben/ausgaben/sonstigeAusgaben",
    pageSchema: { sonstigeAusgaben: sonstigeZahlungArraySchema },
    arrayPages: {
      daten: {
        pageSchema: {
          "sonstigeAusgaben#art": sharedSonstigeZahlungFields.art,
          "sonstigeAusgaben#zahlungsempfaenger":
            sharedSonstigeZahlungFields.zahlungsempfaenger,
        },
      },
      zahlungspflichtiger: {
        pageSchema: {
          "sonstigeAusgaben#zahlungspflichtiger": zahlungspflichtigerSchema,
        },
      },
      betragGemeinsamerAnteil: {
        pageSchema: {
          "sonstigeAusgaben#betragGesamt":
            sharedSonstigeZahlungFields.betragGesamt,
        },
      },
      betragEigenerAnteil: {
        pageSchema: {
          "sonstigeAusgaben#betragEigenerAnteil": betragEigenerAnteilSchema,
        },
      },
      betragGesamt: {
        pageSchema: {
          "sonstigeAusgaben#betragGesamt":
            sharedSonstigeZahlungFields.betragGesamt,
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
