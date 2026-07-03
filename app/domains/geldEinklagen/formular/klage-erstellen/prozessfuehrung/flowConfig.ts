import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type GeldEinklagenKlageErstellenPages } from "../pages";
import { type GeldEinklagenFormularUserData } from "../../userData";

const hasFilledProzessfuehrung = (context: GeldEinklagenFormularUserData) => {
  return (
    context.pageData?.subflowDoneStates?.[
      "/klage-erstellen/prozessfuehrung"
    ] === true
  );
};

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
  prozessfuehrungZahlungNachKlageeinreichung: [
    {
      guard: (context) => hasFilledProzessfuehrung(context),
      target: "rechtlicherZusatzWeitereAntraege",
    },
  ],
} satisfies Partial<TransitionConfigMap<GeldEinklagenKlageErstellenPages>>;
