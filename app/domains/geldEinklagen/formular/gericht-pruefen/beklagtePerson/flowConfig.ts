import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type GeldEinklagenGerichtPruefenPages } from "../pages";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import {
  shouldVisitGerichtSuchenGerichtsstandsvereinbarung,
  shouldVisitGerichtSuchenPostleitzahlWohnraum,
} from "../gericht-suchen/guards";

export const gerichtPruefenBeklagtePersonFlowConfig = {
  beklagtePersonGegenWen: [
    {
      guard: (context) =>
        context.gegenWenBeklagen === "person" &&
        context.sachgebiet === "urheberrecht",
      target: "beklagtePersonGeldVerdienen",
    },
    {
      guard: (context) =>
        context.gegenWenBeklagen === "organisation" &&
        context.sachgebiet === "urheberrecht" &&
        context.klagendeVerbraucher === "no" &&
        context.klagendeKaufmann === "yes",
      target: "beklagtePersonKaufmann",
    },
    {
      guard: (context) =>
        context.sachgebiet === "miete" &&
        (context.mietePachtRaum === "no" ||
          context.mietePachtVertrag === "no") &&
        context.klagendeKaufmann === "yes",
      target: "beklagtePersonKaufmann",
    },
    {
      guard: (context) =>
        (context.sachgebiet === "verkehrsunfall" ||
          context.sachgebiet === "versicherung" ||
          context.sachgebiet === "schaden") &&
        context.klagendeKaufmann === "yes",
      target: "beklagtePersonKaufmann",
    },
    {
      guard: (context) =>
        context.klagendeVerbraucher === "no" &&
        context.klagendeKaufmann === "yes",
      target: "beklagtePersonKaufmann",
    },
    {
      guard: (context) =>
        objectKeysNonEmpty(context, ["gegenWenBeklagen"]) &&
        shouldVisitGerichtSuchenPostleitzahlWohnraum({ context }),
      target: "gerichtSuchenPostleitzahlWohnraum",
    },
    {
      target: "gerichtSuchenPostleitzahlBeklagtePerson",
    },
  ],
  beklagtePersonGeldVerdienen: [
    {
      guard: (context) =>
        context.beklagtePersonGeldVerdienen === "yes" &&
        context.klagendeVerbraucher === "no" &&
        context.klagendeKaufmann === "yes",
      target: "beklagtePersonKaufmann",
    },
    {
      target: "gerichtSuchenPostleitzahlBeklagtePerson",
    },
  ],
  beklagtePersonKaufmann: [
    {
      guard: (context) => context.beklagtePersonKaufmann === "yes",
      target: "beklagtePersonGerichtsstandsvereinbarung",
    },
    {
      target: "gerichtSuchenPostleitzahlBeklagtePerson",
    },
  ],
  beklagtePersonGerichtsstandsvereinbarung: [
    {
      guard: (context) =>
        shouldVisitGerichtSuchenGerichtsstandsvereinbarung({ context }),
      target: "gerichtSuchenPostleitzahlGerichtsstandsvereinbarung",
    },
    {
      target: "gerichtSuchenPostleitzahlBeklagtePerson",
    },
  ],
} satisfies Partial<TransitionConfigMap<GeldEinklagenGerichtPruefenPages>>;
