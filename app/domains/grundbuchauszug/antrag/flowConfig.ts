import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/flowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";
import { grundbuchauszugAntragPages } from "./pages";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { type GrundbuchauszugAntragUserData } from "./userData";
import { arrayIsNonEmpty } from "~/util/array";

const isPersoenlichenDatenDone = (context: GrundbuchauszugAntragUserData) => {
  return context.pageData?.subflowDoneStates?.["/persoenliche-daten"] === true;
};

export const grundbuchauszugAntragFlowConfig = compileFlow({
  pages: grundbuchauszugAntragPages,
  initialStep: "start",
  transitions: {
    start: "antragsgrundBerechtigtesInteresse",
    antragsgrundBerechtigtesInteresse: [
      {
        guard: (context) => context.legitimateInterest === "owner",
        target: "grundstuecksdaten",
      },
      {
        guard: (context) =>
          context.legitimateInterest === "landRegisterOnMyName",
        target: "antragsgrundAngabenZumRecht",
      },
      {
        guard: (context) => context.legitimateInterest === "otherReasons",
        target: "antragsgrundNachweisHochladen",
      },
    ],
    antragsgrundAngabenZumRecht: [
      {
        guard: (context) => objectKeysNonEmpty(context, ["registerLaw"]),
        target: "grundstuecksdaten",
      },
    ],
    antragsgrundNachweisHochladen: [
      {
        guard: (context) => arrayIsNonEmpty(context.proofFiles),
        target: "grundstuecksdaten",
      },
    ],
    grundstuecksdaten: [
      {
        guard: (context) =>
          objectKeysNonEmpty(context, [
            "landRegistryLocale",
            "landRegisterParcel",
            "landRegisterPageNumber",
          ]),
        target: "artAuszug",
      },
    ],
    artAuszug: [
      {
        guard: (context) => objectKeysNonEmpty(context, ["typeOfCopy"]),
        target: "anzahlAusdrucke",
      },
    ],
    anzahlAusdrucke: [
      {
        guard: (context) => objectKeysNonEmpty(context, ["numberOfCopies"]),
        target: "persoenlicheDatenName",
      },
    ],
    persoenlicheDatenName: "persoenlicheDatenGeburtsdatum",
    persoenlicheDatenGeburtsdatum: "persoenlicheDatenAnschrift",
    persoenlicheDatenAnschrift: "persoenlicheDatenkontakt",
    persoenlicheDatenkontakt: [
      {
        guard: isPersoenlichenDatenDone,
        target: "abgabeZusammenfassung",
      },
    ],
    abgabeZusammenfassung: null,
  },
}) as CompiledFlow<PageConfigMap>;
