import { klageParteinArraySchema as klageParteienArraySchema } from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import { type PagesConfig } from "~/domains/pageSchemas";

export const beklagteParteiPages = {
  beklagteUebersicht: {
    stepId: "/beklagte-partei/beklagten/uebersicht",
    arraySummary: {
      name: "beklagten",
      schema: klageParteienArraySchema,
      isArrayRelevant: () => true,
    },
  },
  beklagteNatuerlichePerson: {
    stepId: "/beklagte-partei/beklagten/natuerliche-person",
  },
  beklagteOrganisation: {
    stepId: "/beklagte-partei/beklagten/organisation",
  },
} as const satisfies PagesConfig;
