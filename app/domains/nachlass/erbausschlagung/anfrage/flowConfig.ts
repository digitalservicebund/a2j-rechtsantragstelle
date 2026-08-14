import { TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import {
  nachlassErbausschlagungAnfragePages,
  NachlassErbausschlagungAnfragePages,
} from "./pages";
import { compileFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { ausschlagendePersonFlowConfig } from "./ausschlagendePerson/flowConfig";
import { kinderFlowConfig } from "./kinder/flowConfig";
import { verstorbenePersonFlowConfig } from "./verstorbene/flowConfig";

export const erbausschlagungAnfrageFlowConfig = compileFlow({
  pages: nachlassErbausschlagungAnfragePages,
  initialStep: "start",
  transitions: {
    start: "datenverarbeitung",
    datenverarbeitung: [
      {
        guard: (context) => context.datenverarbeitungZustimmung === "on",
        target: "verstorbeneName",
      },
    ],
    ...verstorbenePersonFlowConfig,
    ...ausschlagendePersonFlowConfig,
    ...kinderFlowConfig,
    abgabeWeitereInformation: null,
    abgabeZusammenfassung: null,
    abgabeEnde: null,
  } satisfies Partial<TransitionConfigMap<NachlassErbausschlagungAnfragePages>>,
});
