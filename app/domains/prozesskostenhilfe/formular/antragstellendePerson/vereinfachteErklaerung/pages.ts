import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { childBirthdaySchema } from "~/services/validation/date";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const einnahmenArraySchema = z
  .object({
    beschreibung: stringRequiredSchema,
    betrag: buildMoneyValidationSchema(),
    zahlungsfrequenz: z.enum(["monthly", "quarterly", "yearly", "one-time"]),
  })
  .array()
  .min(1);

const vermoegenArraySchema = z
  .object({
    beschreibung: stringRequiredSchema,
    wert: buildMoneyValidationSchema(),
  })
  .array()
  .min(1);

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
  },
  einnahmenFrage: {
    stepId:
      "antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahmen-frage",
    pageSchema: {
      hasEinnahmen: YesNoAnswer,
    },
  },
  einnahmenValue: {
    stepId:
      "antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahmen-value",
    pageSchema: {
      hohesEinkommen: YesNoAnswer,
    },
  },
  einnahmenUebersicht: {
    stepId:
      "antragstellende-person/vereinfachte-erklaerung/einnahmen/uebersicht",
  },
  einnahme: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahme",
    pageSchema: {
      einnahmen: einnahmenArraySchema,
    },
    arrayPages: {
      daten: {
        pageSchema: {
          "einnahmen#beschreibung": stringRequiredSchema,
          "einnahmen#betrag": buildMoneyValidationSchema(),
          "einnahmen#zahlungsfrequenz":
            einnahmenArraySchema.element.shape.zahlungsfrequenz,
        },
      },
    },
  },
  einnahmenWarnung: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/einnahmen/warnung",
  },
  vermoegen: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/vermoegen",
  },
  vermoegenFrage: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/vermoegen/frage",
    pageSchema: {
      hasVermoegen: YesNoAnswer,
    },
  },
  vermoegenValue: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/vermoegen/value",
    pageSchema: {
      vermoegenUnder10000: YesNoAnswer,
    },
  },
  vermoegenUebersicht: {
    stepId:
      "antragstellende-person/vereinfachte-erklaerung/vermoegen/uebersicht",
  },
  vermoegenEintrag: {
    stepId: "antragstellende-person/vereinfachte-erklaerung/vermoegen/eintrag",
    pageSchema: {
      vermoegen: vermoegenArraySchema,
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
    stepId: "antragstellende-person/vereinfachte-erklaerung/vermoegen/warnung",
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
