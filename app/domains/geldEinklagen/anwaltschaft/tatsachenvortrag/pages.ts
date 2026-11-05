import { hauptantraegeArraySchema } from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
import { absaetzeArraySchema } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";
import { stringRequiredMaxSchema } from "~/services/validation/stringRequired";

export const tatsachenvortragPages = {
  antraegeUebersicht: {
    stepId: "/tatsachenvortrag-beweise/uebersicht",
    arraySummary: {
      name: "hauptantrag",
      schema: hauptantraegeArraySchema,
      isArrayRelevant: () => true,
    },
  },
  absaetzeUebersicht: {
    stepId: "/tatsachenvortrag-beweise/hauptantrag/#/absaetze",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "hauptantrag#absaetze",
      schema: absaetzeArraySchema,
      isArrayRelevant: () => true,
    },
  },
  absatzDaten: {
    stepId: "/tatsachenvortrag-beweise/hauptantrag/#/absaetze/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "hauptantrag#absaetze#formulierung": stringRequiredMaxSchema({
        max: 10000,
      }),
    },
  },
  nebenantragAbsatzUebersicht: {
    stepId: "/tatsachenvortrag-beweise/hauptantrag/#/nebenantrag/#/absaetze",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "hauptantrag#nebenantrag#absaetze",
      schema: absaetzeArraySchema,
      isArrayRelevant: () => true,
    },
  },
  nebenantragAbsatzDaten: {
    stepId:
      "/tatsachenvortrag-beweise/hauptantrag/#/nebenantrag/#/absaetze/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "hauptantrag#nebenantrag#absaetze#formulierung": stringRequiredMaxSchema({
        max: 10000,
      }),
    },
  },
} as const satisfies PageConfigMap;
