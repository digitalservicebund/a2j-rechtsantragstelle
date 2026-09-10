import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../pages";

export const persoenlicheDatenFlowConfig = {
  persoenlicheDatenStart: [],
  name: [],
  geburtsdatum: [],
  plz: [],
  adresse: [],
  telefonnummer: [],
  beruf: [],
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
