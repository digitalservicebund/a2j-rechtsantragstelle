import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import {
  financialEntryInputSchema,
  kinderSchema,
} from "~/domains/shared/formular/finanzielleAngaben/userData";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const pkhFormularVereinfachteErklaerungPages = {
  kind: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/kind",
    pageSchema: {
      child: kinderSchema.pick({
        vorname: true,
        nachname: true,
      }),
    },
  },
  zusammenleben: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/zusammenleben",
    pageSchema: {
      livesTogether: YesNoAnswer,
    },
  },
  veUnterhalt: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/unterhalt",
    pageSchema: {
      child: kinderSchema.pick({ unterhaltsSumme: true }),
    },
  },
  minderjaehrig: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
    pageSchema: {
      minderjaehrig: YesNoAnswer,
    },
  },
  geburtsdatum: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/geburtsdatum",
    pageSchema: {
      child: kinderSchema.pick({ geburtsdatum: true }),
    },
  },
  worumGehts: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/worum-gehts",
    pageSchema: {
      unterhaltsOrAbstammungssachen: YesNoAnswer,
    },
  },
  rechtlichesThema: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/rechtliches-thema",
    pageSchema: {
      rechtlichesThema: z.enum(
        ["unterhalt", "vollstreckung", "abstammung", "other"],
        customRequiredErrorMessage,
      ),
    },
  },
  einnahmen: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/einnahmen",
    pageSchema: {
      hasEinnahmen: YesNoAnswer,
    },
  },
  einnahmenValue: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/einnahmen-value",
    pageSchema: {
      hohesEinkommen: YesNoAnswer,
    },
  },
  einnahmenUebersicht: {
    stepId:
      "antragstellende-person/vereinfachte-erklaerung/einnahmen-uebersicht",
  },
  einnahmeDaten: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/einnahme/daten",
    pageSchema: {
      einnahmen: z.array(financialEntryInputSchema),
    },
  },
  einnahmenWarnung: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/einnahmen-warnung",
  },
  vermoegen: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/vermoegen",
    pageSchema: {
      hasVermoegen: YesNoAnswer,
    },
  },
  vermoegenValue: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/vermoegen-value",
    pageSchema: {
      vermoegenUnder10000: YesNoAnswer,
    },
  },
  vermoegenUebersicht: {
    stepId:
      "antragstellende-person/vereinfachte-erklaerung/vermoegen-uebersicht",
  },
  vermoegenDaten: {
    stepId:
      "antragstellende-person/vereinfachte-erklaerung/vermoegen-eintrag/daten",
    pageSchema: {
      vermoegen: z.array(
        z
          .object({
            beschreibung: stringRequiredSchema,
            wert: buildMoneyValidationSchema(),
          })
          .partial(),
      ),
    },
  },
  vermoegenWarnung: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/vermoegen-warnung",
  },
  hinweisWeiteresFormular: {
    stepId:
      "antragstellende-person/vereinfachte-erklaerung/hinweis-weiteres-formular",
  },
  hinweisVereinfachteErklaerung: {
    stepId:
      "antragstellende-person/vereinfachte-erklaerung/hinweis-vereinfachte-erklaerung",
  },
} as const satisfies PagesConfig;
