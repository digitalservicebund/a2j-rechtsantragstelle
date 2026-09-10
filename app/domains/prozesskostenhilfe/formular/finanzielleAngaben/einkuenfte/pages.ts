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
    stepId: "/finanzielle-angaben/einkuenfte/start",
    shouldCollapseIntoParentNavItem: true,
  },
  staatlicheLeistungen: {
    stepId: "/finanzielle-angaben/einkuenfte/staatliche-leistungen",
    shouldCollapseIntoParentNavItem: true,
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
    stepId: "/finanzielle-angaben/einkuenfte/buergergeld",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      buergergeld: buildMoneyValidationSchema(),
    },
  },
  arbeitslosengeld: {
    stepId: "/finanzielle-angaben/einkuenfte/arbeitslosengeld",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      arbeitslosengeld: buildMoneyValidationSchema(),
    },
  },
  erwerbstaetig: {
    stepId: "/finanzielle-angaben/einkuenfte/einkommen/erwerbstaetig",
    shouldCollapseIntoParentNavItem: true,

    pageSchema: {
      currentlyEmployed: YesNoAnswer,
    },
  },
  art: {
    stepId: "/finanzielle-angaben/einkuenfte/einkommen/art",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      employmentType: z.enum([
        "employed",
        "selfEmployed",
        "employedAndSelfEmployed",
      ]),
    },
  },
  nettoEinkommen: {
    stepId: "/finanzielle-angaben/einkuenfte/einkommen/netto-einkommen",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      nettoEinkuenfteAlsArbeitnehmer: buildMoneyValidationSchema(),
    },
  },
  selbststaendig: {
    stepId: "/finanzielle-angaben/einkuenfte/einkommen/selbststaendig",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      selbststaendigMonatlichesEinkommen: buildMoneyValidationSchema(),
      selbststaendigBruttoNetto: z.enum(["brutto", "netto"]),
    },
  },
  selbststaendigAbzuege: {
    stepId: "/finanzielle-angaben/einkuenfte/einkommen/selbststaendig-abzuege",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      selbststaendigAbzuege: buildMoneyValidationSchema(),
    },
  },
  renteFrage: {
    stepId: "/finanzielle-angaben/einkuenfte/rente-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      receivesPension: YesNoAnswer,
    },
  },
  rente: {
    stepId: "/finanzielle-angaben/einkuenfte/rente",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      pensionAmount: buildMoneyValidationSchema(),
    },
  },
  leistungenFrage: {
    stepId: "/finanzielle-angaben/einkuenfte/leistungen/frage",
    shouldCollapseIntoParentNavItem: true,
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
    stepId: "/finanzielle-angaben/einkuenfte/leistungen/wohngeld",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      wohngeldAmount: buildMoneyValidationSchema(),
    },
  },
  krankengeld: {
    stepId: "/finanzielle-angaben/einkuenfte/leistungen/krankengeld",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      krankengeldAmount: buildMoneyValidationSchema(),
    },
  },
  elterngeld: {
    stepId: "/finanzielle-angaben/einkuenfte/leistungen/elterngeld",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      elterngeldAmount: buildMoneyValidationSchema(),
    },
  },
  kindergeld: {
    stepId: "/finanzielle-angaben/einkuenfte/leistungen/kindergeld",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      kindergeldAmount: buildMoneyValidationSchema(),
    },
  },
  weitereEinkuenfte: {
    stepId: "/finanzielle-angaben/einkuenfte/weitere-einkuenfte",
    shouldCollapseIntoParentNavItem: true,
  },
  weitereEinkunft: {
    stepId:
      "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/einkunft/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "weitereEinkuenfte#beschreibung":
        weitereEinkuenfteArraySchema.element.shape.beschreibung,
      "weitereEinkuenfte#zahlungsfrequenz":
        weitereEinkuenfteArraySchema.element.shape.zahlungsfrequenz,
      "weitereEinkuenfte#betrag":
        weitereEinkuenfteArraySchema.element.shape.betrag,
    },
  },
  weitereEinkuenfteFrage: {
    stepId: "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      hasFurtherIncome: YesNoAnswer,
    },
  },
  weitereEinkuenfteUebersicht: {
    stepId: "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "weitereEinkuenfte",
      schema: weitereEinkuenfteArraySchema,
      fieldName: "hasFurtherIncome",
    },
  },
  weitereEinkuenfteWarnung: {
    shouldCollapseIntoParentNavItem: true,
    stepId: "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/warnung",
  },
} as const satisfies PagesConfig;
