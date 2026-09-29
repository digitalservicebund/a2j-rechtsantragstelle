import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type BeratungshilfeFormularPages } from "../pages";

export const abgabeFlowConfig = {
  ueberpruefung: "zusammenfassung",
  zusammenfassung: "art",
  art: [
    {
      guard: (context) => context.abgabeArt === "online",
      target: "online",
    },
    {
      guard: (context) => context.abgabeArt === "ausdrucken",
      target: "ausdrucken",
    },
  ],
  ausdrucken: null,
  online: null,
} satisfies Partial<TransitionConfigMap<BeratungshilfeFormularPages>>;
