import { klagendeParteiFlowConfig } from "~/domains/geldEinklagen/anwaltschaft/klagende-partei/flowConfig";
import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { geldEinklagenAnwaltschaftPages } from "./pages";
import { beklagteParteiFlowConfig } from "./beklagte-partei/flowConfig";

export const geldEinklagenAnwaltschaftFlowConfig: CompiledFlow<PageConfigMap> =
  compileFlow({
    pages: geldEinklagenAnwaltschaftPages,
    initialStep: "voraussetzungen",
    transitions: {
      voraussetzungen: "klageInhalt",
      klageInhalt: "pilotgericht",
      pilotgericht: "klagendeUebersicht",
      ...klagendeParteiFlowConfig,
      prozessualeAusfuehrungen: "rechtlicheWuerdigung",
      rechtlicheWuerdigung: "beklagteUebersicht",
      ...beklagteParteiFlowConfig,
      beklagteNatuerlichePerson: null,
      beklagteOrganisation: null,
      downloadKlage: null,
    },
    pruningStrategy: "cascading",
  });
