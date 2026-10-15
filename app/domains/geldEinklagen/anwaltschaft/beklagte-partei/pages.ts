import { klageParteinArraySchema } from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import { type PagesConfig } from "~/domains/pageSchemas";

export const beklagteParteiPages = {
  beklagteUebersicht: {
    stepId: "/beklagte-partei/beklagte/uebersicht",
    arraySummary: {
      name: "beklagten",
      schema: klageParteinArraySchema,
      isArrayRelevant: () => true,
    },
  },
  beklagteNatuerlichePerson: {
    stepId: "/beklagte-partei/beklagte/natuerliche-person",
  },
  beklagteOrganisation: {
    stepId: "/beklagte-partei/beklagte/organisation",
  },
} as const satisfies PagesConfig;

export type BeklagteParteiPages = typeof beklagteParteiPages;
