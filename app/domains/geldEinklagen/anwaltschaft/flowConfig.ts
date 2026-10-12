import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { geldEinklagenAnwaltschaftPages } from "./pages";

export const geldEinklagenAnwaltschaftFlowConfig: CompiledFlow<PageConfigMap> =
  compileFlow({
    pages: geldEinklagenAnwaltschaftPages,
    initialStep: "voraussetzungen",
    transitions: {
      voraussetzungen: "klageInhalt",
      klageInhalt: "pilotgericht",
      pilotgericht: "prozessualeAusfuehrungen", // TODO: wire up to Klagende
      prozessualeAusfuehrungen: "rechtlicheWuerdigung",
      rechtlicheWuerdigung: "downloadKlage",
      downloadKlage: null,
    },
    pruningStrategy: "cascading",
  });
