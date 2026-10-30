import { type PageConfigMap } from "~/services/flow/flowEngine/types";

export const tatsachenvortragPages = {
  tatsachenvortragBeweiseUebersicht: {
    stepId: "/tatsachenvortrag-beweise/uebersicht",
  },
} as const satisfies PageConfigMap;
