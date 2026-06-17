import { compileFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { geldEinklagenFormularPages } from "./pages";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { gerichtPruefenIntroFlowConfig } from "./gericht-pruefen/intro/flowConfig";
import { gerichtPruefenSachgebietFlowConfig } from "./gericht-pruefen/sachgebiet/flowConfig";
import { gerichtPruefenKlagendePersonFlowConfig } from "./gericht-pruefen/klagendePerson/flowConfig";
import { gerichtPruefenBeklagtePersonFlowConfig } from "./gericht-pruefen/beklagtePerson/flowConfig";
import { gerichtPruefenGerichtSuchenFlowConfig } from "./gericht-pruefen/gericht-suchen/flowConfig";

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
    zustaendigesGerichtPilotGericht: null,
    zustaendigesGerichtPilotGerichtAuswahl: null,
    zustaendigesGerichtGerichtAbbruch: null,
    klageErstellenIntroStart: null,
    streitWertKostenGerichtskostenvorschuss: null,
    streitwertKostenWeitereKosten: null,
    klagendePersonKontaktdaten: null,
    klagendePersonAnwaltschaft: null,
    beklagtePersonMenschen: null,
    beklagtePersonOrganisation: null,
    forderungGesamtbetrag: null,
    sachverhaltBegruendung: null,
    beweiseAngebot: null,
    beweiseBeschreibung: null,
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
