import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { fromXStateGuard } from "../flowConfigGuards";
import { fluggastrechteGuards } from "../guards";
import type { FluggastrechteFormularPages } from "../pagesNewFlowEngine";
import { personDone, weiterePersonenDone } from "./doneFunctions";

export const persoenlicheDatenFlowConfig = {
  personDaten: [
    {
      target: "weiterePersonenFrage",
      guard: fromXStateGuard(personDone),
    },
  ],
  weiterePersonenFrage: [
    {
      target: "weiterePersonenUebersicht",
      guard: fromXStateGuard(fluggastrechteGuards.isWeiterePersonenYes),
    },
    {
      target: "prozessfuehrungZeugen",
      guard: fromXStateGuard(weiterePersonenDone),
    },
  ],
  weiterePersonenUebersicht: [
    {
      target: "weiterePersonenDaten",
      type: "addArrayItem",
    },
    {
      target: "weiterePersonenWarnung",
      guard: fromXStateGuard(fluggastrechteGuards.isMissingAddWeiterePersonen),
    },
    {
      target: "prozessfuehrungZeugen",
      guard: fromXStateGuard(weiterePersonenDone),
    },
  ],
  weiterePersonenDaten: "weiterePersonenUebersicht",
  weiterePersonenWarnung: "weiterePersonenUebersicht",
} satisfies Partial<TransitionConfigMap<FluggastrechteFormularPages>>;
