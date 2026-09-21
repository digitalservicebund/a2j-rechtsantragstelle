import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { fluggastrechteGuards } from "../guards";
import type { FluggastrechteFormularPages } from "../pagesNewFlowEngine";
import { weiterePersonenDone } from "./doneFunctions";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export const persoenlicheDatenFlowConfig = {
  personDaten: [
    {
      target: "weiterePersonenFrage",
      guard: (context) =>
        objectKeysNonEmpty(context, [
          "vorname",
          "nachname",
          "strasse",
          "hausnummer",
          "plz",
          "ort",
        ]),
    },
  ],
  weiterePersonenFrage: [
    {
      target: "weiterePersonenUebersicht",
      guard: fluggastrechteGuards.isWeiterePersonenYes,
    },
    {
      target: "prozessfuehrungZeugen",
      guard: weiterePersonenDone,
    },
  ],
  weiterePersonenUebersicht: [
    {
      target: "weiterePersonenDaten",
      type: "addArrayItem",
    },
    {
      target: "weiterePersonenWarnung",
      guard: fluggastrechteGuards.isMissingAddWeiterePersonen,
    },
    {
      target: "prozessfuehrungZeugen",
      guard: weiterePersonenDone,
    },
  ],
  weiterePersonenDaten: "weiterePersonenUebersicht",
  weiterePersonenWarnung: "weiterePersonenUebersicht",
} satisfies Partial<TransitionConfigMap<FluggastrechteFormularPages>>;
