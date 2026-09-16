import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { besondereBelastungenInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { createDateSchema } from "~/services/validation/dateString";
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

export const versicherungenArraySchema = z
  .array(
    z.union([
      z.object({
        art: z.enum(
          versicherungenArtSchema.options.filter((art) => art !== "sonstige"),
        ),
        beitrag: buildMoneyValidationSchema(),
      }),
      z.object({
        art: z.literal(versicherungenArtSchema.enum.sonstige),
        beitrag: buildMoneyValidationSchema(),
        sonstigeArt: stringRequiredSchema,
      }),
    ]),
  )
  .min(1);

const betragEigenerAnteilSchema = buildMoneyValidationSchema();

const sharedRatenZahlungFields = {
  art: stringRequiredSchema,
  zahlungsempfaenger: stringRequiredSchema,
  betragGesamt: buildMoneyValidationSchema(),
  restschuld: buildMoneyValidationSchema(),
  laufzeitende: createDateSchema({ earliest: () => today() }),
};

export const ratenZahlungArraySchema = z
  .array(
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
  )
  .min(1);

const sharedSonstigeZahlungFields = {
  art: stringRequiredSchema,
  zahlungsempfaenger: stringRequiredSchema,
  betragGesamt: buildMoneyValidationSchema(),
};

export const sonstigeZahlungArraySchema = z
  .array(
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
  )
  .min(1);

export const pkhFormularFinanzielleAngabenAusgabenPages = {
  ausgabenFrage: {
    stepId: "/finanzielle-angaben/ausgaben/ausgaben-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      hasAusgaben: YesNoAnswer,
    },
  },
  ausgabenVersicherungenFrage: {
    stepId: "/finanzielle-angaben/ausgaben/versicherungen-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      hasVersicherungen: YesNoAnswer,
    },
  },
  ausgabenVersicherungenUebersicht: {
    stepId: "/finanzielle-angaben/ausgaben/versicherungen-uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "versicherungen",
      schema: versicherungenArraySchema,
      fieldName: "hasVersicherungen",
    }
  },
  ausgabenVersicherung: {
    stepId: "/finanzielle-angaben/ausgaben/versicherungen",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "versicherungen#art": versicherungenArtSchema,
      "versicherungen#beitrag":
        versicherungenArraySchema.element.def.options[0].shape.beitrag,
    },
  },
  ausgabenVersicherungSonstigeArt: {
    stepId: "/finanzielle-angaben/ausgaben/versicherungen/#/sonstige-art",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "versicherungen#sonstigeArt":
        versicherungenArraySchema.element.def.options[1].shape.sonstigeArt,
    },
  },
  ausgabenVersicherungenWarnung: {
    stepId: "/finanzielle-angaben/ausgaben/versicherungen-warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  ausgabenRatenzahlungenFrage: {
    stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      hasRatenzahlungen: YesNoAnswer,
    },
  },
  ausgabenRatenzahlungenUebersicht: {
    stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen-uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "ratenzahlungen",
      schema: ratenZahlungArraySchema,
      fieldName: "hasRatenzahlungen",
    },
  },
  ausgabenRatenzahlung: {
    stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "ratenzahlungen#art": sharedRatenZahlungFields.art,
      "ratenzahlungen#zahlungsempfaenger":
        sharedRatenZahlungFields.zahlungsempfaenger,
    },
  },
  ausgabenRatenzahlungZahlungspflichtiger: {
    stepId:
      "/finanzielle-angaben/ausgaben/ratenzahlungen/#/zahlungspflichtiger",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "ratenzahlungen#zahlungspflichtiger": zahlungspflichtigerSchema,
    },
  },
  ausgabenRatenzahlungBetragGemeinsamerAnteil: {
    stepId:
      "/finanzielle-angaben/ausgaben/ratenzahlungen/#/betragGemeinsamerAnteil",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "ratenzahlungen#betragGesamt": sharedRatenZahlungFields.betragGesamt,
    },
  },
  ausgabenRatenzahlungBetragEigenerAnteil: {
    stepId:
      "/finanzielle-angaben/ausgaben/ratenzahlungen/#/betragEigenerAnteil",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "ratenzahlungen#betragEigenerAnteil": betragEigenerAnteilSchema,
    },
  },
  ausgabenRatenzahlungBetragGesamt: {
    stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen/#/betragGesamt",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "ratenzahlungen#betragGesamt": sharedRatenZahlungFields.betragGesamt,
    },
  },
  ausgabenRatenzahlungRestschuld: {
    stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen/#/restschuld",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "ratenzahlungen#restschuld": sharedRatenZahlungFields.restschuld,
    },
  },
  ausgabenRatenzahlungLaufzeitende: {
    stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen/#/laufzeitende",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "ratenzahlungen#laufzeitende": sharedRatenZahlungFields.laufzeitende,
    },
  },
  ausgabenRatenzahlungenWarnung: {
    stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen-warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  ausgabenSonstigeAusgabenFrage: {
    stepId: "/finanzielle-angaben/ausgaben/sonstige-ausgaben-frage",
    pageSchema: {
      hasSonstigeAusgaben: YesNoAnswer,
    },
  },
  ausgabenSonstigeAusgabenUebersicht: {
    stepId: "/finanzielle-angaben/ausgaben/sonstige-ausgaben-uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "sonstigeAusgaben",
      schema: sonstigeZahlungArraySchema,
      fieldName: "hasSonstigeAusgaben",
    },
  },
  ausgabenSonstigeAusgabe: {
    stepId: "/finanzielle-angaben/ausgaben/sonstigeAusgaben",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "sonstigeAusgaben#art": sharedSonstigeZahlungFields.art,
      "sonstigeAusgaben#zahlungsempfaenger":
        sharedSonstigeZahlungFields.zahlungsempfaenger,
    },
  },
  ausgabenSonstigeAusgabeZahlungspflichtiger: {
    stepId:
      "/finanzielle-angaben/ausgaben/sonstigeAusgaben/#/zahlungspflichtiger",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "sonstigeAusgaben#zahlungspflichtiger": zahlungspflichtigerSchema,
    },
  },
  ausgabenSonstigeAusgabeBetragGemeinsamerAnteil: {
    stepId:
      "/finanzielle-angaben/ausgaben/sonstigeAusgaben/#/betragGemeinsamerAnteil",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "sonstigeAusgaben#betragGesamt": sharedSonstigeZahlungFields.betragGesamt,
    },
  },
  ausgabenSonstigeAusgabeBetragEigenerAnteil: {
    stepId:
      "/finanzielle-angaben/ausgaben/sonstigeAusgaben/#/betragEigenerAnteil",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "sonstigeAusgaben#betragEigenerAnteil": betragEigenerAnteilSchema,
    },
  },
  ausgabenSonstigeAusgabeBetragGesamt: {
    stepId: "/finanzielle-angaben/ausgaben/sonstigeAusgaben/#/betragGesamt",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "sonstigeAusgaben#betragGesamt": sharedSonstigeZahlungFields.betragGesamt,
    },
  },
  ausgabenSonstigeAusgabenWarnung: {
    stepId: "/finanzielle-angaben/ausgaben/sonstige-ausgaben-warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  ausgabenBesondereBelastungen: {
    stepId: "/finanzielle-angaben/ausgaben/besondere-belastungen",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      besondereBelastungen: besondereBelastungenInputSchema,
    },
  },
} as const satisfies PagesConfig;
