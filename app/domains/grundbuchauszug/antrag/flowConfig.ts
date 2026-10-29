import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/flowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";
import { grundbuchauszugAntragPages } from "./pages";

export const grundbuchauszugAntragFlowConfig = compileFlow({
  pages: grundbuchauszugAntragPages,
  initialStep: "start",
  transitions: {
    start: "antragsgrundBerechtigtesInteresse",
    antragsgrundBerechtigtesInteresse: [
      {
        guard: (context) =>
          context.legitimateInterest === "landRegisterOnMyName",
        target: "antragsgrundAngabenZumRecht",
      },
      {
        target: "antragsgrundNachweisHochladen",
      },
    ],
    antragsgrundAngabenZumRecht: "antragsgrundNachweisHochladen",
    antragsgrundNachweisHochladen: "grundstuecksdaten",
    grundstuecksdaten: "artAuszug",
    artAuszug: "anzahlAusdrucke",
    anzahlAusdrucke: "persoenlicheDatenName",
    persoenlicheDatenName: "persoenlicheDatenGeburtsdatum",
    persoenlicheDatenGeburtsdatum: "persoenlicheDatenAnschrift",
    persoenlicheDatenAnschrift: "persoenlicheDatenkontakt",
    persoenlicheDatenkontakt: "abgabeZusammenfassung",
    abgabeZusammenfassung: null,
  },
}) as CompiledFlow<PageConfigMap>;
