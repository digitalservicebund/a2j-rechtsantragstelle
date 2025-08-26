import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const pkhFormularFinanzielleAngabenPartnerPages = {
  partnerEinkuenfte: {
    stepId: "finanzielle-angaben/partner-einkuenfte",
  },
  partnerschaft: {
    stepId: "finanzielle-angaben/partner/partnerschaft",
    pageSchema: {
      partnerschaft: z.enum(["yes", "no", "separated", "widowed"]),
    },
  },
  partnerStaatlicheLeistungen: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-staatliche-leistungen",
    pageSchema: {
      "partner-staatlicheLeistungen": z.enum([
        "buergergeld",
        "arbeitslosengeld",
        "grundsicherung",
        "asylbewerberleistungen",
        "keine",
      ]),
    },
  },
  partnerZusammenleben: {
    stepId: "finanzielle-angaben/partner/zusammenleben",
    pageSchema: {
      zusammenleben: YesNoAnswer,
    },
  },
  partnerUnterhalt: {
    stepId: "finanzielle-angaben/partner/unterhalt",
    pageSchema: {
      unterhalt: YesNoAnswer,
    },
  },
  partnerUnterhaltsSumme: {
    stepId: "finanzielle-angaben/partner/unterhalts-summe",
    pageSchema: {
      partnerUnterhaltsSumme: buildMoneyValidationSchema(),
    },
  },
  partnerKeineRolle: {
    stepId: "finanzielle-angaben/partner/keine-rolle",
  },
  partnerEinkommen: {
    stepId: "finanzielle-angaben/partner/partner-einkommen",
    pageSchema: {
      partnerEinkommen: YesNoAnswer,
    },
  },

  partnerEinkuenfteUnterhalt: {
    stepId: "finanzielle-angaben/partner/partner-einkuenfte/partner-unterhalt",
  },
  partnerEinkuenfteUnterhaltFrage: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-unterhalt-frage",
    pageSchema: {
      "partner-receivesSupport": YesNoAnswer,
    },
  },
  partnerEinkuenfteKeineRolle: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-keine-rolle",
  },
  partnerEinkuenfteUnterhaltsSumme: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-unterhalt/partner-unterhalts-summe",
    pageSchema: {
      "partner-unterhaltsSumme": buildMoneyValidationSchema(),
    },
  },
  partnerEinkuenfteEinkommen: {
    stepId: "finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen",
  },
  partnarErwerbstaetig: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-erwerbstaetig",
    pageSchema: {
      "partner-currentlyEmployed": YesNoAnswer,
    },
  },
  partnerBuergergeld: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-buergergeld",
    pageSchema: {
      "partner-buergergeld": buildMoneyValidationSchema(),
    },
  },
  partnerArbeitslosengeld: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-arbeitslosengeld",
    pageSchema: {
      "partner-arbeitslosengeld": buildMoneyValidationSchema(),
    },
  },
  partnerErwerbstaetig: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-erwerbstaetig",
    pageSchema: {
      currentlyEmployed: YesNoAnswer,
    },
  },
  partnerRenteFrage: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-rente-frage",
    pageSchema: {
      "partner-receivesPension": YesNoAnswer,
    },
  },
  partnerRente: {
    stepId: "finanzielle-angaben/partner/partner-einkuenfte/partner-rente",
    pageSchema: {
      "partner-pensionAmount": buildMoneyValidationSchema(),
    },
  },
  partnerArt: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-art",
    pageSchema: {
      "partner-employmentType": z.enum([
        "employed",
        "selfEmployed",
        "employedAndSelfEmployed",
      ]),
    },
  },
  partnerNettoEinkommen: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-netto-einkommen",
    pageSchema: {
      "partner-nettoEinkuenfteAlsArbeitnehmer": buildMoneyValidationSchema(),
    },
  },
  partnerSelbststaendig: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-selbststaendig",
    pageSchema: {
      "partner-selbststaendigMonatlichesEinkommen":
        buildMoneyValidationSchema(),
      "partner-selbststaendigBruttoNetto": z.enum(["brutto", "netto"]),
    },
  },
  partnerAbzuege: {
    stepId: "finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege",
  },
  partnerSelbststaendigAbzuege: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-selbststaendig-abzuege",
    pageSchema: {
      "partner-selbststaendigAbzuege": buildMoneyValidationSchema(),
    },
  },
  partnerName: {
    stepId: "finanzielle-angaben/partner/partner-name",
    pageSchema: {
      partnerVorname: stringRequiredSchema,
      partnerNachname: stringRequiredSchema,
    },
  },
  partnerArbeitsweg: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsweg",
    pageSchema: {
      "partner-arbeitsweg": z.enum([
        "publicTransport",
        "privateVehicle",
        "bike",
        "walking",
        "none",
      ]),
    },
  },
  partnerOpnvKosten: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-opnv-kosten",
    pageSchema: {
      "partner-monatlicheOPNVKosten": buildMoneyValidationSchema(),
    },
  },
  partnerArbeitsplatzEntfernung: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsplatz-entfernung",
    pageSchema: {
      "partner-arbeitsplatz": z.object({
        strasseHausnummer: stringRequiredSchema,
        plz: stringRequiredSchema.pipe(postcodeSchema),
        ort: stringRequiredSchema,
      }),
      "partner-arbeitsplatzEntfernung": integerSchema.refine(
        (distance) => distance > 0,
        {
          message: "invalidInteger",
        },
      ),
    },
  },
  partnerArbeitswegKeineRolle: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-keine-rolle",
  },
  partnerArbeitsausgaben: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben",
    arrayPages: {
      "partner-daten": {
        pageSchema: {
          "partner-arbeitsausgaben#beschreibung": z.string().min(1, "required"),
          "partner-arbeitsausgaben#zahlungsfrequenz": z.enum([
            "monthly",
            "quarterly",
            "yearly",
            "one-time",
          ]),
          "partner-arbeitsausgaben#betrag": buildMoneyValidationSchema(),
        },
      },
    },
  },
  partnerArbeitsausgabenFrage: {
    stepId:
      "finanzielle-angaben/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgaben-frage",
    pageSchema: {
      hasArbeitsausgaben: YesNoAnswer,
    },
  },
  partnerArbeitsausgabenUebersicht: {
    stepId:
      "finanzielle-angaben/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgaben-uebersicht",
  },

  partnerArbeitsausgabenWarnung: {
    stepId:
      "finanzielle-angaben/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgaben-warnung",
  },
  partnerEinkuenfteLeistungen: {
    stepId: "finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen",
  },
  partnerLeistungFrage: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-frage",
    pageSchema: {
      "partner-hasWohngeld": checkedOptional,
      "partner-hasKrankengeld": checkedOptional,
      "partner-hasElterngeld": checkedOptional,
      "partner-hasKindergeld": checkedOptional,
    },
  },

  partnerWohngeld: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-wohngeld",
    pageSchema: {
      "partner-wohngeldAmount": buildMoneyValidationSchema(),
    },
  },
  partnerKrankengeld: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-krankengeld",
    pageSchema: {
      "partner-krankengeldAmount": buildMoneyValidationSchema(),
    },
  },
  partnerElterngeld: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-elterngeld",
    pageSchema: {
      "partner-elterngeldAmount": buildMoneyValidationSchema(),
    },
  },
  partnerKindergeld: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-kindergeld",
    pageSchema: {
      "partner-kindergeldAmount": buildMoneyValidationSchema(),
    },
  },
  partnerWeitereEinkuenfteUebersicht: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-uebersicht",
  },
  partnerWeitereEinkuenfte: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte",
    arrayPages: {
      "partner-daten": {
        pageSchema: {
          "partner-weitereEinkuenfte#beschreibung": z
            .string()
            .min(1, "required"),
          "partner-weitereEinkuenfte#zahlungsfrequenz": z.enum([
            "monthly",
            "quarterly",
            "yearly",
            "one-time",
          ]),
          "partner-weitereEinkuenfte#betrag": buildMoneyValidationSchema(),
        },
      },
    },
  },
  partnerWeitereEinkuenfteFrage: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-frage",
    pageSchema: {
      "partner-hasFurtherIncome": YesNoAnswer,
    },
  },
  partnerWeitereEinkuenfteWarnung: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-warnung",
  },
  partnerBesondersAusgaben: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-besonders-ausgaben",
    pageSchema: {
      partnerHasBesondersAusgaben: YesNoAnswer,
    },
  },
  partnerAddBesondersAusgaben: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/add-partner-besonders-ausgaben",
    pageSchema: {
      partnerBesondersAusgabe: z.object({
        beschreibung: stringRequiredSchema,
        betrag: buildMoneyValidationSchema(),
      }),
    },
  },
} as const satisfies PagesConfig;
