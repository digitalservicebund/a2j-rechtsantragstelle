import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { type GeldEinklagenGerichtPruefenPages } from "../pages";

export const gerichtPruefenIntroFlowConfig = {
  introAnwaltschaft: [
    {
      guard: (context) => context.anwaltschaft === "yes",
      target: "introVoraussetzungenAnwaltschaft",
    },
    { target: "introVoraussetzungen" },
  ],
  introVoraussetzungenAnwaltschaft: "introStart",
  introVoraussetzungen: "introStart",
  introStart: [
    {
      guard: (context) => objectKeysNonEmpty(context, ["anwaltschaft"]),
      target: "forderungWas",
    },
  ],
} satisfies Partial<TransitionConfigMap<GeldEinklagenGerichtPruefenPages>>;
