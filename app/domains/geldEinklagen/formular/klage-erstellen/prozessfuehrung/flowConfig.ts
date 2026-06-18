import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type GeldEinklagenKlageErstellenPages } from "../pages";

export const klageErstellenProzessfuehrungFlowConfig = {
  prozessfuehrungAnwaltskosten: "prozessfuehrungProzesszinsen",
  prozessfuehrungProzesszinsen: "prozessfuehrungStreitbeilegung",
  prozessfuehrungStreitbeilegung: [
    {
      guard: (context) =>
        context.streitbeilegung === "yes" ||
        context.streitbeilegung === "noSpecification",
      target: "prozessfuehrungMuendlicheVerhandlung",
    },
    {
      target: "prozessfuehrungStreitbeilegungGruende",
    },
  ],
  prozessfuehrungStreitbeilegungGruende: "prozessfuehrungMuendlicheVerhandlung",
  prozessfuehrungMuendlicheVerhandlung: "prozessfuehrungVideoVerhandlung",
  prozessfuehrungVideoVerhandlung: "prozessfuehrungVersaeumnisurteil",
  prozessfuehrungVersaeumnisurteil:
    "prozessfuehrungZahlungNachKlageeinreichung",
  prozessfuehrungZahlungNachKlageeinreichung:
    "rechtlicherZusatzWeitereAntraege",
} satisfies Partial<TransitionConfigMap<GeldEinklagenKlageErstellenPages>>;
