import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";

export const vereinfachteErklaerungFlowConfig = {
  kind: [],
  zusammenleben: [],
  veUnterhalt: [],
  minderjaehrig: [],
  veGeburtsdatum: [],
  worumGehts: [],
  rechtlichesThema: [],
  einnahmen: [],
  vermoegen: [],
  hinweisWeiteresFormular: [],
  hinweisVereinfachteErklaerung: [],
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
