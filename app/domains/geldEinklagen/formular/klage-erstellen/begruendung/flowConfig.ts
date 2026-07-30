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
  begruendungBeschreibungAbschnitte: [
    {
      type: "addArrayItem",
      target: "begruendungBeschreibungAbschnitteBeweisDocument",
    },
    {
      type: "addArrayItem",
      target: "begruendungBeschreibungAbschnitteBeweisPersonAuswahl",
    },
    {
      target: "begruendungBeschreibungUebersicht",
    },
  ],
  begruendungBeschreibungAbschnitteBeweisDocument:
    "begruendungBeschreibungUebersicht",
  begruendungBeschreibungAbschnitteBeweisPersonAuswahl: [
    {
      guard: ({ abschnitte, pageData }) => {
        const arrayIndexes = pageData?.arrayIndexes;

        if (!abschnitte || !arrayIndexes || arrayIndexes.length < 2)
          return false;

        const abschnittIndex = arrayIndexes[0];
        const beweisePersonenIndex = arrayIndexes[1];

        const abschnitt = abschnitte[abschnittIndex];
        if (!abschnitt?.beweiseDokumenten?.[beweisePersonenIndex]) return false;

        return true;
      },
      target: "begruendungBeschreibungAbschnitteBeweisPerson",
    },
    {
      target: "begruendungBeschreibungUebersicht",
    },
  ],
  begruendungBeschreibungAbschnitteBeweisPerson:
    "begruendungBeschreibungUebersicht",
} satisfies Partial<TransitionConfigMap<GeldEinklagenKlageErstellenPages>>;
