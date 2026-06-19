import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type GeldEinklagenGerichtPruefenPages } from "../pages";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export const gerichtPruefenKlagendePersonFlowConfig = {
  klagendePersonFuerWen: [
    {
      guard: (context) => context.fuerWenKlagen === "organisation",
      target: "klagendePersonErrorAbbruch",
    },
    {
      guard: (context) =>
        context.sachgebiet === "miete" &&
        context.mietePachtVertrag === "yes" &&
        context.mietePachtRaum === "yes" &&
        objectKeysNonEmpty(context, ["fuerWenKlagen"]),
      target: "beklagtePersonGegenWen",
    },
    {
      guard: (context) =>
        context.sachgebiet === "schaden" ||
        context.sachgebiet === "verkehrsunfall" ||
        context.sachgebiet === "versicherung" ||
        (context.sachgebiet === "miete" && context.mietePachtVertrag === "no"),
      target: "klagendePersonKaufmann",
    },
    { target: "klagendePersonVerbraucher" },
  ],
  klagendePersonErrorAbbruch: null,
  klagendePersonVerbraucher: [
    {
      guard: (context) => context.klagendeVerbraucher === "no",
      target: "klagendePersonKaufmann",
    },
    {
      guard: (context) =>
        context.klagendeVerbraucher === "yes" && context.sachgebiet === "miete",
      target: "klagendePersonHaustuergeschaeft",
    },
    {
      guard: (context) =>
        context.klagendeVerbraucher === "yes" &&
        (context.sachgebiet === "reisen" ||
          context.sachgebiet === "urheberrecht" ||
          context.sachgebiet === "anderesRechtsproblem"),
      target: "klagendePersonVertrag",
    },
    {
      target: "beklagtePersonGegenWen",
    },
  ],
  klagendePersonKaufmann: "beklagtePersonGegenWen",
  klagendePersonVertrag: [
    {
      guard: (context) => context.klagendeVertrag === "yes",
      target: "klagendePersonHaustuergeschaeft",
    },
    {
      target: "beklagtePersonGegenWen",
    },
  ],
  klagendePersonHaustuergeschaeft: "beklagtePersonGegenWen",
} satisfies Partial<TransitionConfigMap<GeldEinklagenGerichtPruefenPages>>;
