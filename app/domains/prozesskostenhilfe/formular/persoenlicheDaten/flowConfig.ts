import { compileFlow, CompiledFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { pkhFormularPersoenlicheDatenPages } from "./pages";

export const persoenlicheDatenFlowConfig = compileFlow({
  pages: pkhFormularPersoenlicheDatenPages,
  initialStep: "persoenlicheDatenStart",
  transitions: {
      persoenlicheDatenStart: "name",
      name: "geburtsdatum",
      geburtsdatum: "plz",
      plz: "adresse",
      adresse: "telefonnummer",
      telefonnummer: "beruf",
      beruf: null
  },
  pruningStrategy: "cascading",
}) as CompiledFlow<PageConfigMap>;
