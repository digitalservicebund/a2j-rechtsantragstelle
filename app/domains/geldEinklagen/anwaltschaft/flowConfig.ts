import { beklagteParteiFlowConfig } from "~/domains/geldEinklagen/anwaltschaft/beklagte-partei/flowConfig";
import { klagendeParteiFlowConfig } from "~/domains/geldEinklagen/anwaltschaft/klagende-partei/flowConfig";
import { sonstigeNebenUndProzessantraegeFlowConfig } from "~/domains/geldEinklagen/anwaltschaft/sonstigeNebenUndProzessantraege/flowConfig";
import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/flowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";
import { geldEinklagenAnwaltschaftPages } from "./pages";
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
      prozessualeAusfuehrungen: "rechtlicheWuerdigung",
      rechtlicheWuerdigung: "sonstigeNebenUndProzessantraegeUebersicht",
      ...sonstigeNebenUndProzessantraegeFlowConfig,
      downloadKlage: null,
    },
    pruningStrategy: "cascading",
  });
