import { hauptantragArraySchema } from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";

export const tatsachenvortragPages = {
  tatsachenvortragBeweiseUebersicht: {
    stepId: "/tatsachenvortrag-beweise/uebersicht",
    arraySummary: {
      name: "hauptantrag",
      schema: hauptantragArraySchema,
      isArrayRelevant: () => true,
    },
  },
} as const satisfies PageConfigMap;
