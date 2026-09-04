import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { z } from "zod";
import {
  abschnitteArray,
  type GeldEinklagenKlageErstellenPages,
} from "../pages";

export const klageErstellenBegruendungFlowConfig = {
  begruendungEinfuehrungStart: "begruendungBeschreibungUebersicht",
  begruendungBeschreibungUebersicht: [
    { type: "addArrayItem", target: "begruendungBeschreibungAbschnitte" },
    {
      guard: (context) => !z.validate(abschnitteArray, context.abschnitte),
      target: "begruendungBeschreibungWarnung",
    },
    { target: "prozessfuehrungAnwaltskosten" },
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
  begruendungBeschreibungAbschnitteBeweisDocument: [
    {
      target: "begruendungBeschreibungUebersicht",
    },
  ],
  begruendungBeschreibungAbschnitteBeweisPersonAuswahl: [
    {
      guard: ({ abschnitte, pageData }) => {
        const arrayIndexes = pageData?.arrayIndexes;

        if (!abschnitte || !arrayIndexes || arrayIndexes.length < 2)
          return false;

        const abschnittIndex = arrayIndexes[0];
        const beweisePersonenIndex = arrayIndexes[1];

        const abschnitt = abschnitte[abschnittIndex];

        return (
          abschnitt?.personen?.[beweisePersonenIndex]?.personAuswahl ===
          "anotherPerson"
        );
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
