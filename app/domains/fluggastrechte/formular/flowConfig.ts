import { compileFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { abgabeFlowConfig } from "./abgabe/flowConfig";
import { flugdatenFlowConfig } from "./flugdaten/flowConfig";
import { grundvoraussetzungenFlowConfig } from "./grundvoraussetzungen/flowConfig";
import { introFlowConfig } from "./intro/flowConfig";
import { fluggastrechteFormularPagesNewFlowEngine } from "./pagesNewFlowEngine";
import { persoenlicheDatenFlowConfig } from "./persoenlicheDaten/flowConfig";
import { prozessfuehrungFlowConfig } from "./prozessfuehrung/flowConfig";
import { streitwertKostenFlowConfig } from "./streitwertKosten/flowConfig";
import { zusammenfassungFlowConfig } from "./zusammenfassung/flowConfig";

export const fluggastrechteFormularFlowConfig = compileFlow({
  pages: fluggastrechteFormularPagesNewFlowEngine,
  initialStep: "intro",
  transitions: {
    ...introFlowConfig,
    ...grundvoraussetzungenFlowConfig,
    ...streitwertKostenFlowConfig,
    ...flugdatenFlowConfig,
    ...persoenlicheDatenFlowConfig,
    ...prozessfuehrungFlowConfig,
    ...zusammenfassungFlowConfig,
    ...abgabeFlowConfig,
  },
});
