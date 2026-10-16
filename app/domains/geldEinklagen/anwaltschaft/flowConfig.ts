import { beklagteParteiFlowConfig } from "~/domains/geldEinklagen/anwaltschaft/beklagte-partei/flowConfig";
import { klagendeParteiFlowConfig } from "~/domains/geldEinklagen/anwaltschaft/klagende-partei/flowConfig";
import { sonstigeNebenUndProzessantraegeFlowConfig } from "~/domains/geldEinklagen/anwaltschaft/sonstigeNebenUndProzessantraege/flowConfig";
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
      pilotgericht: "klagendeUebersicht",
      ...klagendeParteiFlowConfig,
      ...beklagteParteiFlowConfig,
      prozessualeAusfuehrungen: "rechtlicheWuerdigung",
      rechtlicheWuerdigung: "sonstigeNebenUndProzessantraegeUebersicht",
      beklagteNatuerlichePerson: null,
      beklagteOrganisation: null,
      ...sonstigeNebenUndProzessantraegeFlowConfig,
      downloadKlage: null,
    },
    pruningStrategy: "cascading",
  });
