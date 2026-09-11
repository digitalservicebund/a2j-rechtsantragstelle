import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { exclusiveCheckboxesSchema } from "~/services/validation/checkedCheckbox";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const paymentSchema = z.object({
  beschreibung: stringRequiredSchema,
  betrag: buildMoneyValidationSchema(),
  zahlungsfrequenz: z.enum(["monthly", "quarterly", "yearly", "one-time"]),
});

const partnerArbeitsausgabenArraySchema = z.array(paymentSchema).min(1);
const partnerWeitereEinkuenfteArraySchema = z.array(paymentSchema).min(1);

export const pkhFormularFinanzielleAngabenPartnerPages = {
  partnerschaft: {
    stepId: "/finanzielle-angaben/partner/partnerschaft",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      partnerschaft: z.enum(["yes", "no", "separated", "widowed"]),
    },
  },
  partnerZusammenleben: {
    stepId: "/finanzielle-angaben/partner/zusammenleben",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      zusammenleben: YesNoAnswer,
    },
  },
  partnerUnterhalt: {
    stepId: "/finanzielle-angaben/partner/unterhalt",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      unterhalt: YesNoAnswer,
    },
  },
  partnerUnterhaltsSumme: {
    stepId: "/finanzielle-angaben/partner/unterhalts-summe",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      partnerUnterhaltsSumme: buildMoneyValidationSchema(),
    },
  },
  partnerKeineRolle: {
    stepId: "/finanzielle-angaben/partner/keine-rolle",
    shouldCollapseIntoParentNavItem: true,
  },
  partnerEinkommen: {
    stepId: "/finanzielle-angaben/partner/partner-einkommen",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      partnerEinkommen: YesNoAnswer,
    },
  },
  partnerEinkuenfte: {
    stepId: "/finanzielle-angaben/partner/partner-einkuenfte",
    shouldCollapseIntoParentNavItem: true,
  },
  partnerStaatlicheLeistungen: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-staatliche-leistungen",
    shouldCollapseIntoParentNavItem: true,
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
    stepId: "/finanzielle-angaben/partner/partner-einkuenfte/partner-unterhalt",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-supportAmount": buildMoneyValidationSchema(),
    },
  },
  partnerEinkuenfteUnterhaltFrage: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-unterhalt-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-receivesSupport": YesNoAnswer,
    },
  },
  partnerEinkuenfteKeineRolle: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-keine-rolle",
    shouldCollapseIntoParentNavItem: true,
  },
  partnerEinkuenfteEinkommen: {
    stepId: "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen",
    shouldCollapseIntoParentNavItem: true,
  },
  partnerErwerbstaetig: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-erwerbstaetig",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-currentlyEmployed": YesNoAnswer,
    },
  },
  partnerBuergergeld: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-buergergeld",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-buergergeld": buildMoneyValidationSchema(),
    },
  },
  partnerArbeitslosengeld: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-arbeitslosengeld",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-arbeitslosengeld": buildMoneyValidationSchema(),
    },
  },
  partnerRenteFrage: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-rente-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-receivesPension": YesNoAnswer,
    },
  },
  partnerRente: {
    stepId: "/finanzielle-angaben/partner/partner-einkuenfte/partner-rente",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-pensionAmount": buildMoneyValidationSchema(),
    },
  },
  partnerArt: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-art",
    shouldCollapseIntoParentNavItem: true,
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
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-netto-einkommen",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-nettoEinkuenfteAlsArbeitnehmer": buildMoneyValidationSchema(),
    },
  },
  partnerSelbststaendig: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-selbststaendig",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-selbststaendigMonatlichesEinkommen":
        buildMoneyValidationSchema(),
      "partner-selbststaendigBruttoNetto": z.enum(["brutto", "netto"]),
    },
  },
  partnerAbzuege: {
    stepId: "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege",
    shouldCollapseIntoParentNavItem: true,
  },
  partnerSelbststaendigAbzuege: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-selbststaendig-abzuege",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-selbststaendigAbzuege": buildMoneyValidationSchema(),
    },
  },
  partnerName: {
    stepId: "/finanzielle-angaben/partner/partner-name",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      partnerVorname: stringRequiredSchema,
      partnerNachname: stringRequiredSchema,
    },
  },
  partnerArbeitsweg: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsweg",
    shouldCollapseIntoParentNavItem: true,
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
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-opnv-kosten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-monatlicheOPNVKosten": buildMoneyValidationSchema(),
    },
  },
  partnerArbeitsplatzEntfernung: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsplatz-entfernung",
    shouldCollapseIntoParentNavItem: true,
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
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-keine-rolle",
    shouldCollapseIntoParentNavItem: true,
  },
  partnerArbeitsausgaben: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben",
    shouldCollapseIntoParentNavItem: true,
  },
  partnerArbeitsausgabe: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgabe/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-arbeitsausgaben#beschreibung":
        partnerArbeitsausgabenArraySchema.element.shape.beschreibung,
      "partner-arbeitsausgaben#zahlungsfrequenz":
        partnerArbeitsausgabenArraySchema.element.shape.zahlungsfrequenz,
      "partner-arbeitsausgaben#betrag":
        partnerArbeitsausgabenArraySchema.element.shape.betrag,
    },
  },
  partnerArbeitsausgabenFrage: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgaben-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-hasArbeitsausgaben": YesNoAnswer,
    },
  },
  partnerArbeitsausgabenUebersicht: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "partnerArbeitsausgabe",
      schema: partnerArbeitsausgabenArraySchema,
      fieldName: "partner-arbeitsausgaben",
    },
  },
  partnerArbeitsausgabenWarnung: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgaben-warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  partnerEinkuenfteLeistungen: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen",
    shouldCollapseIntoParentNavItem: true,
  },
  partnerLeistungFrage: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-frage",
    shouldCollapseIntoParentNavItem: true,
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
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-wohngeld",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-wohngeldAmount": buildMoneyValidationSchema(),
    },
  },
  partnerKrankengeld: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-krankengeld",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-krankengeldAmount": buildMoneyValidationSchema(),
    },
  },
  partnerElterngeld: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-elterngeld",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-elterngeldAmount": buildMoneyValidationSchema(),
    },
  },
  partnerKindergeld: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-kindergeld",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-kindergeldAmount": buildMoneyValidationSchema(),
    },
  },
  partnerWeitereEinkuenfte: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte",
    shouldCollapseIntoParentNavItem: true,
  },
  partnerWeitereEinkunft: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-einkunft/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-weitereEinkuenfte#beschreibung":
        partnerWeitereEinkuenfteArraySchema.element.shape.beschreibung,
      "partner-weitereEinkuenfte#zahlungsfrequenz":
        partnerWeitereEinkuenfteArraySchema.element.shape.zahlungsfrequenz,
      "partner-weitereEinkuenfte#betrag":
        partnerWeitereEinkuenfteArraySchema.element.shape.betrag,
    },
  },
  partnerWeitereEinkuenfteFrage: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "partner-hasFurtherIncome": YesNoAnswer,
    },
  },
  partnerWeitereEinkuenfteUebersicht: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "partnerWeitereEinkuenfte",
      schema: partnerWeitereEinkuenfteArraySchema,
      fieldName: "partner-hasFurtherIncome",
    },
  },
  partnerWeitereEinkuenfteWarnung: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  partnerBesondersAusgaben: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/partner-besonders-ausgaben",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      partnerHasBesondersAusgaben: YesNoAnswer,
    },
  },
  partnerAddBesondersAusgaben: {
    stepId:
      "/finanzielle-angaben/partner/partner-einkuenfte/add-partner-besonders-ausgaben",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      partnerBesondersAusgabe: z.object({
        beschreibung: stringRequiredSchema,
        betrag: buildMoneyValidationSchema(),
      }),
    },
  },
} as const satisfies PagesConfig;
