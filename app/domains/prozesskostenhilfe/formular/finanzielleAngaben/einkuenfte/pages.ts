import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import {
  financialEntryInputSchema,
  staatlicheLeistungenInputSchema,
} from "~/domains/shared/formular/finanzielleAngaben/userData";
import { adresseSchema } from "~/domains/shared/formular/persoenlicheDaten/userData";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const pkhFormularFinanzielleAngabenEinkuenftePages = {
  einkuenfteStart: {
    stepId: "finanzielle-angaben/einkuenfte/start",
  },
  staatlicheLeistungen: {
    stepId: "finanzielle-angaben/einkuenfte/staatliche-leistungen",
    pageSchema: {
      staatlicheLeistungen: z.enum(
        [...staatlicheLeistungenInputSchema.options, "arbeitslosengeld"],
        customRequiredErrorMessage,
      ),
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
      employmentType: z.enum(
        ["employed", "selfEmployed", "employedAndSelfEmployed"],
        customRequiredErrorMessage,
      ),
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
      selbststaendigBruttoNetto: z.enum(
        ["brutto", "netto"],
        customRequiredErrorMessage,
      ),
    },
  },
  selbststaendigAbzuege: {
    stepId: "finanzielle-angaben/einkuenfte/einkommen/selbststaendig-abzuege",
    pageSchema: {
      selbststaendigAbzuege: buildMoneyValidationSchema(),
    },
  },
  arbeitsweg: {
    stepId: "finanzielle-angaben/einkuenfte/abzuege/arbeitsweg",
    pageSchema: {
      arbeitsweg: z.enum(
        ["publicTransport", "privateVehicle", "bike", "walking", "none"],
        customRequiredErrorMessage,
      ),
    },
  },
  opnvKosten: {
    stepId: "finanzielle-angaben/einkuenfte/abzuege/opnv-kosten",
    pageSchema: {
      monatlicheOPNVKosten: buildMoneyValidationSchema(),
    },
  },
  arbeitsplatzEntfernung: {
    stepId: "finanzielle-angaben/einkuenfte/abzuege/arbeitsplatz-entfernung",
    pageSchema: {
      arbeitsplatz: z.object({ ...adresseSchema }).omit({
        street: true,
        houseNumber: true,
      }),
      arbeitsplatzEntfernung: integerSchema.refine((distance) => distance > 0, {
        message: "invalidInteger",
      }),
    },
  },
  arbeitswegKeineRolle: {
    stepId: "finanzielle-angaben/einkuenfte/abzuege/keine-rolle",
  },
  arbeitsausgabenFrage: {
    stepId:
      "finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
    pageSchema: {
      hasArbeitsausgaben: YesNoAnswer,
    },
  },
  arbeitsausgabenUebersicht: {
    stepId: "finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/uebersicht",
  },
  // TODO: adapt to new pageSchema array pattern
  arbeitsausgabeDaten: {
    stepId:
      "finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgabe/daten",
    pageSchema: {
      arbeitsausgaben: z.array(financialEntryInputSchema),
    },
  },
  arbeitsausgabenWarnung: {
    stepId: "finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/warnung",
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
      hasWohngeld: checkedOptional,
      hasKrankengeld: checkedOptional,
      hasElterngeld: checkedOptional,
      hasKindergeld: checkedOptional,
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
  // TODO: adapt to new pageSchema array pattern
  weitereEinkuenfteDaten: {
    stepId: "finanzielle-angaben/einkuenfte/weitere-einkuenfte/einkunft/daten",
    pageSchema: {
      weitereEinkuenfte: z.array(financialEntryInputSchema),
    },
  },
} as const satisfies PagesConfig;
