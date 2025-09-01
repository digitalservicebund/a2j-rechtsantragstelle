import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import {
  childBirthdaySchema,
  financialEntryInputSchema,
} from "~/domains/shared/formular/finanzielleAngaben/userData";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const pkhFormularVereinfachteErklaerungPages = {
  kind: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/kind",
    pageSchema: {
      child: z.object({
        vorname: stringRequiredSchema,
        nachname: stringRequiredSchema,
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
      child: z.object({ unterhaltsSumme: buildMoneyValidationSchema() }),
    },
  },
  minderjaehrig: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
    pageSchema: {
      minderjaehrig: YesNoAnswer,
    },
  },
  veGeburtsdatum: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/geburtsdatum",
    pageSchema: {
      child: z.object({ geburtsdatum: childBirthdaySchema }),
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
      rechtlichesThema: z.enum([
        "unterhalt",
        "vollstreckung",
        "abstammung",
        "other",
      ]),
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
  einnahme: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/einnahme",
    pageSchema: {
      einnahmen: z.array(financialEntryInputSchema),
    },
    arrayPages: {
      daten: {
        pageSchema: {
          "einnahmen#beschreibung": stringRequiredSchema,
          "einnahmen#betrag": buildMoneyValidationSchema(),
          "einnahmen#zahlungsfrequenz": z.enum([
            "monthly",
            "quarterly",
            "yearly",
            "one-time",
          ]),
        },
      },
    },
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
  vermoegenEintrag: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/vermoegen-eintrag",
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
    arrayPages: {
      daten: {
        pageSchema: {
          "vermoegen#beschreibung": stringRequiredSchema,
          "vermoegen#wert": buildMoneyValidationSchema(),
        },
      },
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
