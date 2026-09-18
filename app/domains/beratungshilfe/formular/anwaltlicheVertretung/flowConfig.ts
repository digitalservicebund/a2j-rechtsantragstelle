import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type BeratungshilfeFormularPages } from "../pages";
import { beratungshilfeAnwaltlicheVertretungGuards as guards } from "./guards";

export const anwaltlicheVertretungFlowConfig = {
  anwaltskanzlei: [
    {
      guard: (context) => guards.anwaltskanzleiYes({ context }),
      target: "beratungStattgefunden",
    },
    { target: "rechtsproblemStart" },
  ],
  beratungStattgefunden: [
    {
      guard: (context) => guards.beratungStattgefundenYes({ context }),
      target: "beratungStattgefundenDatum",
    },
    { target: "rechtsproblemStart" },
  ],
  beratungStattgefundenDatum: [
    {
      guard: (context) =>
        guards.beratungStattgefundenWithinFourWeeks({ context }),
      target: "fristHinweis",
    },
    { target: "anwaltEnde" },
  ],
  fristHinweis: "anwaltKontaktdaten",
  anwaltKontaktdaten: "rechtsproblemStart",
  anwaltEnde: null,
} satisfies Partial<TransitionConfigMap<BeratungshilfeFormularPages>>;
