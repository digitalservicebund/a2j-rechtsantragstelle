import { beklagteParteiFlowConfig } from "~/domains/geldEinklagen/anwaltschaft/beklagte-partei/flowConfig";
import { klagendeParteiFlowConfig } from "~/domains/geldEinklagen/anwaltschaft/klagende-partei/flowConfig";
import { sonstigeAntraegeFlowConfig } from "~/domains/geldEinklagen/anwaltschaft/sonstigeAntraege/flowConfig";
import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/flowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";
import { geldEinklagenAnwaltschaftPages } from "./pages";
import { tatsachenvortragFlowConfig } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/flowConfig";
import { hauptUndNebenantraegeFlowConfig } from "./hauptUndNebenantraege/flowConfig";

export const geldEinklagenAnwaltschaftFlowConfig: CompiledFlow<PageConfigMap> =
  compileFlow({
    pages: geldEinklagenAnwaltschaftPages,
    initialStep: "voraussetzungen",
    transitions: {
      voraussetzungen: "klageInhalt",
      klageInhalt: "pilotgericht",
      pilotgericht: "klagendeUebersicht",
      ...klagendeParteiFlowConfig,
      ...beklagteParteiFlowConfig,
      ...hauptUndNebenantraegeFlowConfig,
      prozessualeAusfuehrungen: "sonstigeAntraegeUebersicht",
      ...sonstigeAntraegeFlowConfig,
      ...tatsachenvortragFlowConfig,
      rechtlicheWuerdigung: "downloadKlage",
      downloadKlage: null,
    },
    pruningStrategy: "cascading",
  });
