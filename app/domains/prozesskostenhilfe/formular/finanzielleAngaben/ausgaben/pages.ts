import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { besondereBelastungenInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const pkhFormularFinanzielleAngabenAusgabenPages = {
  ausgabenFrage: {
    stepId: "finanzielle-angaben/ausgaben/ausgaben-frage",
    pageSchema: {
      hasAusgaben: YesNoAnswer,
    },
  },
  ausgabenBesondereBelastungen: {
    stepId: "finanzielle-angaben/ausgaben/besondere-belastungen",
    pageSchema: {
      besondereBelastungen: besondereBelastungenInputSchema,
    },
  },
  ausgabenZusammenfassung: {
    stepId: "finanzielle-angaben/ausgaben-zusammenfassung/zusammenfassung",
    pageSchema: {},
  },
  ausgabenZusammenfassungVersicherungen: {
    stepId: "finanzielle-angaben/ausgaben-zusammenfassung/versicherungen",
    pageSchema: {},
    arrayPages: {
      daten: {
        pageSchema: {
          "versicherungen#art": z.enum([
            "haftpflichtversicherung",
            "hausratsversicherung",
            "unfallversicherung",
            "pivateKrankenzusatzversicherung",
            "kfzVersicherung",
            "sonstige",
          ]),
          "versicherungen#beitrag": stringRequiredSchema,
        },
      },
      "sonstige-art": {
        pageSchema: {
          "versicherungen#sonstigeArt": stringOptionalSchema,
        },
      },
    },
  },
  ausgabenZusammenfassungRatenzahlungen: {
    stepId: "finanzielle-angaben/ausgaben-zusammenfassung/ratenzahlungen",
    pageSchema: {},
    arrayPages: {
      daten: {
        pageSchema: {
          "ratenzahlungen#art": stringRequiredSchema,
          "ratenzahlungen#zahlungsempfaenger": stringRequiredSchema,
        },
      },
      zahlungspflichtiger: {
        pageSchema: {
          "ratenzahlungen#zahlungspflichtiger": z.enum([
            "myself",
            "myselfAndPartner",
            "myselfAndSomeoneElse",
          ]),
        },
      },
      betragGemeinsamerAnteil: {
        pageSchema: {
          "ratenzahlungen#betragGesamt": stringRequiredSchema,
        },
      },
      betragEigenerAnteil: {
        pageSchema: {
          "ratenzahlungen#betragEigenerAnteil": stringRequiredSchema,
        },
      },
      betragGesamt: {
        pageSchema: {
          "ratenzahlungen#betragGesamt": stringRequiredSchema,
        },
      },
      restschuld: {
        pageSchema: {
          "ratenzahlungen#restschuld": stringRequiredSchema,
        },
      },
      laufzeitende: {
        pageSchema: {
          "ratenzahlungen#laufzeitende": stringRequiredSchema,
        },
      },
    },
  },
  ausgabenZusammenfassungSonstigeAusgaben: {
    stepId: "finanzielle-angaben/ausgaben-zusammenfassung/sonstigeAusgaben",
    pageSchema: {},
    arrayPages: {
      daten: {
        pageSchema: {
          "sonstigeAusgaben#art": stringRequiredSchema,
          "sonstigeAusgaben#zahlungsempfaenger": stringRequiredSchema,
        },
      },
      zahlungspflichtiger: {
        pageSchema: {
          "sonstigeAusgaben#zahlungspflichtiger": z.enum([
            "myself",
            "myselfAndPartner",
            "myselfAndSomeoneElse",
          ]),
        },
      },
      betragGemeinsamerAnteil: {
        pageSchema: {
          "sonstigeAusgaben#betragGesamt": stringRequiredSchema,
        },
      },
      betragEigenerAnteil: {
        pageSchema: {
          "sonstigeAusgaben#betragEigenerAnteil": stringRequiredSchema,
        },
      },
      betragGesamt: {
        pageSchema: {
          "sonstigeAusgaben#betragGesamt": stringRequiredSchema,
        },
      },
    },
  },
} as const satisfies PagesConfig;
