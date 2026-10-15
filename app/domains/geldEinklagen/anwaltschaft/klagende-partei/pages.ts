import { klageParteinArraySchema } from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import { type PagesConfig } from "~/domains/pageSchemas";

export const klagendeParteiPages = {
  klagendeUebersicht: {
    stepId: "/klagende-partei/klagende/uebersicht",
    arraySummary: {
      name: "klagenden",
      schema: klageParteinArraySchema,
      isArrayRelevant: () => true,
    },
  },
} as const satisfies PagesConfig;
