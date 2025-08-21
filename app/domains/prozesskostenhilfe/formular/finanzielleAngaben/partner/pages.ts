import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import {
  financialEntryInputSchema,
  partnerschaftInputSchema,
  staatlicheLeistungenInputSchema,
} from "~/domains/shared/formular/finanzielleAngaben/userData";
import { adresseSchema } from "~/domains/shared/formular/persoenlicheDaten/userData";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const pkhFormularFinanzielleAngabenPartnerPages = {
  partnerEinkuenfte: {
    stepId: "finanzielle-angaben/partner-einkuenfte",
  },
  partnerschaft: {
    stepId: "finanzielle-angaben/partner/partnerschaft",
    pageSchema: {
      partnerschaft: partnerschaftInputSchema,
    },
  },
  partnerZusammenleben: {
    stepId: "finanzielle-angaben/partner/zusammenleben",
    pageSchema: {
      zusammenleben: YesNoAnswer,
    },
  },
  partnerUnterhalt: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-unterhalt-frage",
    pageSchema: {
      "partner-receivesSupport": YesNoAnswer,
    },
  },
  partnerKeineRolle: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-keine-rolle",
  },
  //TODO: fix this
  partnerUnterhaltsSumme: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-unterhalt/partner-unterhalts-summe",
    pageSchema: {
      "partner-unterhaltsSumme": buildMoneyValidationSchema(),
    },
  },
  partnerEinkommen: {
    stepId: "finanzielle-angaben/partner/partner-einkommen",
    pageSchema: {
      partnerEinkommen: YesNoAnswer,
    },
  },
  partnerEinkommenSumme: {
    stepId: "finanzielle-angaben/partner/partner-einkommen-summe",
    pageSchema: {
      partnerEinkommenSumme: buildMoneyValidationSchema(),
    },
  },
  partnerBuergergeld: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-buergergeld",
    pageSchema: {
      buergergeld: buildMoneyValidationSchema(),
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
      "partner-employmentType": z.enum(
        ["employed", "selfEmployed", "employedAndSelfEmployed"],
        customRequiredErrorMessage,
      ),
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
      "partner-selbststaendigBruttoNetto": z.enum(
        ["brutto", "netto"],
        customRequiredErrorMessage,
      ),
    },
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
      "partner-arbeitsweg": z.enum(
        ["publicTransport", "privateVehicle", "bike", "walking", "none"],
        customRequiredErrorMessage,
      ),
    },
  },
  partnerOpnvKosten: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-opnv-kosten",
    pageSchema: {
      "partner-opnvKosten": buildMoneyValidationSchema(),
    },
  },
  partnerArbeitsplatzEntfernung: {
    stepId:
      "finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsplatz-entfernung",
    pageSchema: {
      "partner-arbeitsplatz": z.object({ ...adresseSchema }).omit({
        street: true,
        houseNumber: true,
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
    pageSchema: {
      arbeitsausgaben: z.array(financialEntryInputSchema),
    },
    arrayPages: {
      "partner-daten": {
        pageSchema: {
          "partner-arbeitsausgaben#beschreibung": z.string().min(1, "required"),
          "partner-arbeitsausgaben#zahlungsfrequenz": z.enum(
            ["monthly", "quarterly", "yearly", "one-time"],
            customRequiredErrorMessage,
          ),
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
    pageSchema: {
      "partner-weitereEinkuenfte#beschreibung": z.string().min(1, "required"),
      "partner-weitereEinkuenfte#zahlungsfrequenz": z.enum(
        ["monthly", "quarterly", "yearly", "one-time"],
        customRequiredErrorMessage,
      ),
      "weitereEinkuenfte#betrag": buildMoneyValidationSchema(),
    },
    arrayPages: {
      "partner-daten": {
        pageSchema: {
          "partner-weitereEinkuenfte#beschreibung": z
            .string()
            .min(1, "required"),
          "partner-weitereEinkuenfte#zahlungsfrequenz": z.enum(
            ["monthly", "quarterly", "yearly", "one-time"],
            customRequiredErrorMessage,
          ),
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
