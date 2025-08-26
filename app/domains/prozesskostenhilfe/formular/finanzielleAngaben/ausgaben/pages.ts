import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

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
      besondereBelastungen: z.object({
        pregnancy: checkedOptional,
        singleParent: checkedOptional,
        disability: checkedOptional,
        medicalReasons: checkedOptional,
      }),
    },
  },
  ausgabenZusammenfassung: {
    stepId: "finanzielle-angaben/ausgaben-zusammenfassung/zusammenfassung",
  },
  ausgabenZusammenfassungVersicherungen: {
    stepId: "finanzielle-angaben/ausgaben-zusammenfassung/versicherungen",
    arrayPages: {
      daten: {
        pageSchema: {
          "versicherungen#art": versicherungenArtSchema,
          "versicherungen#beitrag": buildMoneyValidationSchema(),
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
  ausgabenZusammenfassungSonstigeAusgaben: {
    stepId: "finanzielle-angaben/ausgaben-zusammenfassung/sonstigeAusgaben",
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
} as const satisfies PagesConfig;
