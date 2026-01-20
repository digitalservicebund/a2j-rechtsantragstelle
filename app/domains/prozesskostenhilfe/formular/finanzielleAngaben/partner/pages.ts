import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { exclusiveCheckboxesSchema } from "~/services/validation/checkedCheckbox";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const sharedPaymentFields = {
  beschreibung: stringRequiredSchema,
  betrag: buildMoneyValidationSchema(),
  zahlungsfrequenz: z.enum(["monthly", "quarterly", "yearly", "one-time"]),
};

const partnerArbeitsausgabenArraySchema = z
  .object({
    ...sharedPaymentFields,
  })
  .array()
  .min(1);

const partnerWeitereEinkuenfteArraySchema = z
  .object({
    ...sharedPaymentFields,
  })
  .array()
  .min(1);

export const pkhFormularFinanzielleAngabenPartnerPages = {
  partnerschaft: {
    stepId: "finanzielle-angaben/partner/partnerschaft",
    pageSchema: {
      partnerschaft: z.enum(["yes", "no", "separated", "widowed"]),
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
  partnerEinkuenfte: {
    stepId: "finanzielle-angaben/partner/partner-einkuenfte",
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
  partnerEinkuenfteUnterhalt: {
    stepId: "finanzielle-angaben/partner/partner-einkuenfte/partner-unterhalt",
    pageSchema: {
      "partner-supportAmount": buildMoneyValidationSchema(),
    },
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
  partnerEinkuenfteEinkommen: {
    stepId: "finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen",
  },
  partnerErwerbstaetig: {
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
        plz: stringRequiredSchema,
        ort: stringRequiredSchema,
        land: stringOptionalSchema,
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
  },
  partnerArbeitsausgabe: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgabe",
    pageSchema: {
      "partner-arbeitsausgaben": partnerArbeitsausgabenArraySchema,
    },
    arrayPages: {
      "partner-daten": {
        pageSchema: {
          "partner-arbeitsausgaben#beschreibung":
            partnerArbeitsausgabenArraySchema.element.shape.beschreibung,
          "partner-arbeitsausgaben#zahlungsfrequenz":
            partnerArbeitsausgabenArraySchema.element.shape.zahlungsfrequenz,
          "partner-arbeitsausgaben#betrag":
            partnerArbeitsausgabenArraySchema.element.shape.betrag,
        },
      },
    },
  },
  partnerArbeitsausgabenFrage: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgaben-frage",
    pageSchema: {
      "partner-hasArbeitsausgaben": YesNoAnswer,
    },
  },
  partnerArbeitsausgabenUebersicht: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/uebersicht",
  },

  partnerArbeitsausgabenWarnung: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgaben-warnung",
  },
  partnerEinkuenfteLeistungen: {
    stepId: "finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen",
  },
  partnerLeistungFrage: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-frage",
    pageSchema: {
      partnerLeistungen: exclusiveCheckboxesSchema([
        "wohngeld",
        "krankengeld",
        "elterngeld",
        "kindergeld",
        "none",
      ]),
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
  partnerWeitereEinkuenfte: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte",
  },
  partnerWeitereEinkunft: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-einkunft",
    pageSchema: {
      "partner-weitereEinkuenfte": partnerWeitereEinkuenfteArraySchema,
    },
    arrayPages: {
      "partner-daten": {
        pageSchema: {
          "partner-weitereEinkuenfte#beschreibung":
            partnerWeitereEinkuenfteArraySchema.element.shape.beschreibung,
          "partner-weitereEinkuenfte#zahlungsfrequenz":
            partnerWeitereEinkuenfteArraySchema.element.shape.zahlungsfrequenz,
          "partner-weitereEinkuenfte#betrag":
            partnerWeitereEinkuenfteArraySchema.element.shape.betrag,
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
  partnerWeitereEinkuenfteUebersicht: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/uebersicht",
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
