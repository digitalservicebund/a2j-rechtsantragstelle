import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type GeldEinklagenKlageErstellenPages } from "../pages";
import { arrayIsNonEmpty } from "~/util/array";

export const klageErstellenBegruendungFlowConfig = {
  begruendungEinfuehrungStart: "begruendungBeschreibungUebersicht",
  begruendungBeschreibungUebersicht: [
    { type: "addArrayItem", target: "begruendungBeschreibungAbschnitte" },
    {
      guard: (context) => arrayIsNonEmpty(context.abschnitte),
      target: "prozessfuehrungAnwaltskosten",
    },
    { target: "begruendungBeschreibungWarnung" },
  ],
  begruendungBeschreibungWarnung: null,
  begruendungBeschreibungAbschnitte: "begruendungBeschreibungUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenKlageErstellenPages>>;
