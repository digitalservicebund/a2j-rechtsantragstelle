import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { exclusiveCheckboxesSchema } from "~/services/validation/checkedCheckbox";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export type FinancialEntry = z.infer<
  typeof weitereEinkuenfteArraySchema.element
>;

const weitereEinkuenfteArraySchema = z
  .array(
    z.object({
      beschreibung: stringRequiredSchema,
      betrag: buildMoneyValidationSchema(),
      zahlungsfrequenz: z.enum(["monthly", "quarterly", "yearly", "one-time"]),
    }),
  )
  .min(1);

export const pkhFormularFinanzielleAngabenEinkuenftePages = {
  einkuenfteStart: {
    stepId: "finanzielle-angaben/einkuenfte/start",
  },
  staatlicheLeistungen: {
    stepId: "finanzielle-angaben/einkuenfte/staatliche-leistungen",
    pageSchema: {
      staatlicheLeistungen: z.enum([
        "buergergeld",
        "arbeitslosengeld",
        "grundsicherung",
        "asylbewerberleistungen",
        "keine",
      ]),
    },
  },
  buergergeld: {
    stepId: "finanzielle-angaben/einkuenfte/buergergeld",
    pageSchema: {
      buergergeld: buildMoneyValidationSchema(),
    },
  },
  arbeitslosengeld: {
    stepId: "finanzielle-angaben/einkuenfte/arbeitslosengeld",
    pageSchema: {
      arbeitslosengeld: buildMoneyValidationSchema(),
    },
  },
  erwerbstaetig: {
    stepId: "finanzielle-angaben/einkuenfte/einkommen/erwerbstaetig",
    pageSchema: {
      currentlyEmployed: YesNoAnswer,
    },
  },
  art: {
    stepId: "finanzielle-angaben/einkuenfte/einkommen/art",
    pageSchema: {
      employmentType: z.enum([
        "employed",
        "selfEmployed",
        "employedAndSelfEmployed",
      ]),
    },
  },
  nettoEinkommen: {
    stepId: "finanzielle-angaben/einkuenfte/einkommen/netto-einkommen",
    pageSchema: {
      nettoEinkuenfteAlsArbeitnehmer: buildMoneyValidationSchema(),
    },
  },
  selbststaendig: {
    stepId: "finanzielle-angaben/einkuenfte/einkommen/selbststaendig",
    pageSchema: {
      selbststaendigMonatlichesEinkommen: buildMoneyValidationSchema(),
      selbststaendigBruttoNetto: z.enum(["brutto", "netto"]),
    },
  },
  selbststaendigAbzuege: {
    stepId: "finanzielle-angaben/einkuenfte/einkommen/selbststaendig-abzuege",
    pageSchema: {
      selbststaendigAbzuege: buildMoneyValidationSchema(),
    },
  },

  renteFrage: {
    stepId: "finanzielle-angaben/einkuenfte/rente-frage",
    pageSchema: {
      receivesPension: YesNoAnswer,
    },
  },
  rente: {
    stepId: "finanzielle-angaben/einkuenfte/rente",
    pageSchema: {
      pensionAmount: buildMoneyValidationSchema(),
    },
  },
  leistungenFrage: {
    stepId: "finanzielle-angaben/einkuenfte/leistungen/frage",
    pageSchema: {
      leistungen: exclusiveCheckboxesSchema([
        "wohngeld",
        "krankengeld",
        "elterngeld",
        "kindergeld",
        "none",
      ]),
    },
  },
  wohngeld: {
    stepId: "finanzielle-angaben/einkuenfte/leistungen/wohngeld",
    pageSchema: {
      wohngeldAmount: buildMoneyValidationSchema(),
    },
  },
  krankengeld: {
    stepId: "finanzielle-angaben/einkuenfte/leistungen/krankengeld",
    pageSchema: {
      krankengeldAmount: buildMoneyValidationSchema(),
    },
  },
  elterngeld: {
    stepId: "finanzielle-angaben/einkuenfte/leistungen/elterngeld",
    pageSchema: {
      elterngeldAmount: buildMoneyValidationSchema(),
    },
  },
  kindergeld: {
    stepId: "finanzielle-angaben/einkuenfte/leistungen/kindergeld",
    pageSchema: {
      kindergeldAmount: buildMoneyValidationSchema(),
    },
  },
  weitereEinkuenfte: {
    stepId: "finanzielle-angaben/einkuenfte/weitere-einkuenfte",
  },
  weitereEinkunft: {
    stepId: "finanzielle-angaben/einkuenfte/weitere-einkuenfte/einkunft",
    pageSchema: {
      weitereEinkuenfte: weitereEinkuenfteArraySchema,
    },
    arrayPages: {
      daten: {
        pageSchema: {
          "weitereEinkuenfte#beschreibung":
            weitereEinkuenfteArraySchema.element.shape.beschreibung,
          "weitereEinkuenfte#zahlungsfrequenz":
            weitereEinkuenfteArraySchema.element.shape.zahlungsfrequenz,
          "weitereEinkuenfte#betrag":
            weitereEinkuenfteArraySchema.element.shape.betrag,
        },
      },
    },
  },
  weitereEinkuenfteFrage: {
    stepId: "finanzielle-angaben/einkuenfte/weitere-einkuenfte/frage",
    pageSchema: {
      hasFurtherIncome: YesNoAnswer,
    },
  },
  weitereEinkuenfteUebersicht: {
    stepId: "finanzielle-angaben/einkuenfte/weitere-einkuenfte/uebersicht",
  },
  weitereEinkuenfteWarnung: {
    stepId: "finanzielle-angaben/einkuenfte/weitere-einkuenfte/warnung",
  },
} as const satisfies PagesConfig;
