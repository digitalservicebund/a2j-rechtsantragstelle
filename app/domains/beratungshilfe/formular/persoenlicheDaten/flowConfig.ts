import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type BeratungshilfeFormularPages } from "../pages";

export const persoenlicheDatenFlowConfig = {
  persoenlicheDatenStart: "name",
  name: "geburtsdatum",
  geburtsdatum: "plz",
  plz: "adresse",
  adresse: "telefonnummer",
  telefonnummer: "nachbefragung",
  nachbefragung: "weitereAngaben",
} satisfies Partial<TransitionConfigMap<BeratungshilfeFormularPages>>;
