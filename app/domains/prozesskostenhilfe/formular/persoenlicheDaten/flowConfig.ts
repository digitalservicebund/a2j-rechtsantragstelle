import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type prozesskostenhilfeFormularPages } from "../pages";

export const persoenlicheDatenFlowConfig = {
  persoenlicheDatenStart: "name",
  name: "geburtsdatum",
  geburtsdatum: "plz",
  plz: "adresse",
  adresse: "telefonnummer",
  telefonnummer: "beruf",
  beruf: "weitereAngaben",
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
