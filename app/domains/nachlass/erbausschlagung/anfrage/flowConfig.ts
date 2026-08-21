import type { PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { nachlassErbausschlagungAnfragePages } from "./pages";
import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { ausschlagendePersonFlowConfig } from "./ausschlagendePerson/flowConfig";
import { kinderFlowConfig } from "./kinder/flowConfig";
import { verstorbenePersonFlowConfig } from "./verstorbene/flowConfig";

export const erbausschlagungAnfrageFlowConfig = compileFlow({
  pages: nachlassErbausschlagungAnfragePages,
  initialStep: "start",
  transitions: {
    start: "gerichtsterminBestaetigt",
    gerichtsterminBestaetigt: [
      {
        guard: (context) => context.gerichtsterminBestaetigt === "no",
        target: "gerichtsterminVereinbaren",
      },
      {
        target: "datenverarbeitung",
      },
    ],
    gerichtsterminVereinbaren: null,
    datenverarbeitung: [
      {
        guard: (context) => context.datenverarbeitungZustimmung === "on",
        target: "verstorbeneName",
      },
    ],
    ...verstorbenePersonFlowConfig,
    ...ausschlagendePersonFlowConfig,
    ...kinderFlowConfig,
    abgabeWeitereInformation: [
      {
        guard: (data) => data.weitereInformationen !== undefined,
        target: "abgabeZusammenfassung",
      },
    ],
    abgabeZusammenfassung: "abgabeBestaetigung",
    abgabeBestaetigung: [
      {
        guard: (data) =>
          data.erbausschlagungImGerichtErscheinen === "on" &&
          data.erbausschalgungSechsWochenFrist === "on" &&
          data.erbausschlagungDokumentKeinErsatz === "on",
        target: "abgabeEnde",
      },
    ],
    abgabeEnde: null,
  },
  pruningStrategy: "cascading",
}) as CompiledFlow<PageConfigMap>;
