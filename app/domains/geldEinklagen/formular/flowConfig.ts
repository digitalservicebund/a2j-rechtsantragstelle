import { compileFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { geldEinklagenFormularPages } from "./pages";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { gerichtPruefenIntroFlowConfig } from "./gericht-pruefen/intro/flowConfig";
import { gerichtPruefenSachgebietFlowConfig } from "./gericht-pruefen/sachgebiet/flowConfig";
import { gerichtPruefenKlagendePersonFlowConfig } from "./gericht-pruefen/klagendePerson/flowConfig";
import { gerichtPruefenBeklagtePersonFlowConfig } from "./gericht-pruefen/beklagtePerson/flowConfig";
import { gerichtPruefenGerichtSuchenFlowConfig } from "./gericht-pruefen/gericht-suchen/flowConfig";
import { zustaendigesGerichtDone } from "./gericht-pruefen/zustaendiges-gericht/doneFunctions";
import { hasFilledKlagendePerson } from "./klage-erstellen/klagende-person/xStateConfig";

export const geldEinklagenFlowConfig = compileFlow({
  pages: geldEinklagenFormularPages,
  initialStep: "introAnwaltschaft",
  transitions: {
    ...gerichtPruefenIntroFlowConfig,
    forderungWas: [
      {
        guard: (context) => context.forderung === "etwasAnderes",
        target: "forderungErrorEtwasAnderes",
      },
      {
        target: "sachgebietInfo",
        guard: (context) => objectKeysNonEmpty(context, ["forderung"]),
      },
    ],
    forderungErrorEtwasAnderes: null,
    ...gerichtPruefenSachgebietFlowConfig,
    ...gerichtPruefenKlagendePersonFlowConfig,
    ...gerichtPruefenBeklagtePersonFlowConfig,
    ...gerichtPruefenGerichtSuchenFlowConfig,
    zustaendigesGerichtPilotGerichtAuswahl: "zustaendigesGerichtPilotGericht",
    zustaendigesGerichtPilotGericht: [
      {
        guard: (context) => zustaendigesGerichtDone({ context }),
        target: "klageErstellenIntroStart",
      },
    ],
    zustaendigesGerichtGerichtAbbruch: null,
    klageErstellenIntroStart: "streitWertKostenGerichtskostenvorschuss",
    streitWertKostenGerichtskostenvorschuss: "streitwertKostenWeitereKosten",
    streitwertKostenWeitereKosten: [
      {
        guard: (context) => context.anwaltschaft === "yes",
        target: "klagendePersonAnwaltschaft",
      },
      {
        target: "klagendePersonKontaktdaten",
      },
    ],
    klagendePersonAnwaltschaft: "klagendePersonKontaktdaten",
    klagendePersonKontaktdaten: [
      {
        guard: (context) =>
          context.gegenWenBeklagen === "person" &&
          hasFilledKlagendePerson({ context }),
        target: "beklagtePersonMenschen",
      },
      {
        guard: (context) => hasFilledKlagendePerson({ context }),
        target: "beklagtePersonOrganisation",
      },
    ],
    beklagtePersonMenschen: "forderungGesamtbetrag",
    beklagtePersonOrganisation: "forderungGesamtbetrag",
    forderungGesamtbetrag: [
      {
        guard: (context) =>
          objectKeysNonEmpty(context, ["forderungGesamtbetrag"]),
        target: "sachverhaltBegruendung",
      },
    ],
    sachverhaltBegruendung: [
      {
        guard: (context) =>
          objectKeysNonEmpty(context, ["sachverhaltBegruendung"]),
        target: "beweiseAngebot",
      },
    ],
    beweiseAngebot: [
      {
        guard: (context) => context.beweiseAngebot === "yes",
        target: "beweiseBeschreibung",
      },
      {
        guard: (context) => context.beweiseAngebot === "no",
        target: "prozessfuehrungAnwaltskosten",
      },
    ],
    beweiseBeschreibung: [
      {
        guard: (context) =>
          objectKeysNonEmpty(context, ["beweiseBeschreibung"]),
        target: "prozessfuehrungAnwaltskosten",
      },
    ],
    prozessfuehrungAnwaltskosten: null,
    prozessfuehrungProzesszinsen: null,
    prozessfuehrungStreitbeilegung: null,
    prozessfuehrungStreitbeilegungGruende: null,
    prozessfuehrungMuendlicheVerhandlung: null,
    prozessfuehrungVideoVerhandlung: null,
    prozessfuehrungVersaeumnisurteil: null,
    prozessfuehrungZahlungNachKlageeinreichung: null,
    rechtlicherZusatzWeitereAntraege: null,
    rechtlicherZusatzRechtlicheWuerdigung: null,
    zusammenfassungUebersicht: null,
  },
});
