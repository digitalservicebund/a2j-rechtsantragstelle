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
      pilotgericht: "rechtlicheWuerdigung", // TODO: wire up to Klagende
      rechtlicheWuerdigung: null,
      //   downloadKlageschrift: null,
    },
    pruningStrategy: "cascading",
  });
