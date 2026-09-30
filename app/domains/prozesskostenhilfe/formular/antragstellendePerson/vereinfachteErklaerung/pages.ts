import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { childBirthdaySchema } from "~/services/validation/dateString";
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

const childSchema = z
  .object({
    vorname: stringRequiredSchema,
    nachname: stringRequiredSchema,
    geburtsdatum: childBirthdaySchema,
    unterhaltsSumme: buildMoneyValidationSchema(),
  })
  .partial();

export const pkhFormularVereinfachteErklaerungPages = {
  kind: {
    stepId: "/antragstellende-person/vereinfachte-erklaerung/kind",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      child: childSchema.pick({ vorname: true, nachname: true }),
    },
  },
  zusammenleben: {
    stepId: "/antragstellende-person/vereinfachte-erklaerung/zusammenleben",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      livesTogether: YesNoAnswer,
    },
  },
  veUnterhalt: {
    stepId: "/antragstellende-person/vereinfachte-erklaerung/unterhalt",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      child: childSchema.pick({ unterhaltsSumme: true }),
    },
  },
  minderjaehrig: {
    stepId: "/antragstellende-person/vereinfachte-erklaerung/minderjaehrig",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      minderjaehrig: YesNoAnswer,
    },
  },
  veGeburtsdatum: {
    stepId: "/antragstellende-person/vereinfachte-erklaerung/geburtsdatum",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      child: childSchema.pick({ geburtsdatum: true }),
    },
  },
  worumGehts: {
    stepId: "/antragstellende-person/vereinfachte-erklaerung/worum-gehts",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      unterhaltsOrAbstammungssachen: YesNoAnswer,
    },
  },
  rechtlichesThema: {
    stepId: "/antragstellende-person/vereinfachte-erklaerung/rechtliches-thema",
    shouldCollapseIntoParentNavItem: true,
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
    stepId: "/antragstellende-person/vereinfachte-erklaerung/einnahmen",
    shouldCollapseIntoParentNavItem: true,
  },
  einnahmenFrage: {
    stepId:
      "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahmen-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      hasEinnahmen: YesNoAnswer,
    },
  },
  einnahmenValue: {
    stepId:
      "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahmen-value",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      hohesEinkommen: YesNoAnswer,
    },
  },
  einnahmenUebersicht: {
    stepId:
      "/antragstellende-person/vereinfachte-erklaerung/einnahmen/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "einnahmen",
      schema: einnahmenArraySchema,
      fieldName: "hasEinnahmen",
    },
  },
  einnahme: {
    stepId:
      "/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahme/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "einnahmen#beschreibung": stringRequiredSchema,
      "einnahmen#betrag": buildMoneyValidationSchema(),
      "einnahmen#zahlungsfrequenz":
        einnahmenArraySchema.element.shape.zahlungsfrequenz,
    },
  },
  einnahmenWarnung: {
    stepId: "/antragstellende-person/vereinfachte-erklaerung/einnahmen/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  vermoegen: {
    stepId: "/antragstellende-person/vereinfachte-erklaerung/vermoegen",
    shouldCollapseIntoParentNavItem: true,
  },
  vermoegenFrage: {
    stepId: "/antragstellende-person/vereinfachte-erklaerung/vermoegen/frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      hasVermoegen: YesNoAnswer,
    },
  },
  vermoegenValue: {
    stepId: "/antragstellende-person/vereinfachte-erklaerung/vermoegen/value",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      vermoegenUnder10000: YesNoAnswer,
    },
  },
  vermoegenUebersicht: {
    stepId:
      "/antragstellende-person/vereinfachte-erklaerung/vermoegen/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "vermoegen",
      schema: vermoegenArraySchema,
      fieldName: "hasVermoegen",
    },
  },
  vermoegenEintrag: {
    stepId:
      "/antragstellende-person/vereinfachte-erklaerung/vermoegen/eintrag/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "vermoegen#beschreibung": stringRequiredSchema,
      "vermoegen#wert": buildMoneyValidationSchema(),
    },
  },
  vermoegenWarnung: {
    stepId: "/antragstellende-person/vereinfachte-erklaerung/vermoegen/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  hinweisWeiteresFormular: {
    stepId:
      "/antragstellende-person/vereinfachte-erklaerung/hinweis-weiteres-formular",
    shouldCollapseIntoParentNavItem: true,
  },
  hinweisVereinfachteErklaerung: {
    shouldCollapseIntoParentNavItem: true,
    stepId:
      "/antragstellende-person/vereinfachte-erklaerung/hinweis-vereinfachte-erklaerung",
  },
} as const satisfies PagesConfig;
