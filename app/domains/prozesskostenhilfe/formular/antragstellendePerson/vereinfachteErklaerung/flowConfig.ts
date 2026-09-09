import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type prozesskostenhilfeFormularPages } from "../../pages";

export const vereinfachteErklaerungFlowConfig = {
  kind: [],
  zusammenleben: [],
  veUnterhalt: [],
  minderjaehrig: [],
  veGeburtsdatum: [],
  worumGehts: [],
  rechtlichesThema: [],
  einnahmen: [],
  einnahmenFrage: [],
  einnahmenValue: [],
  einnahmenUebersicht: [],
  einnahme: [],
  einnahmenWarnung: [],
  vermoegen: [],
  vermoegenFrage: [],
  vermoegenValue: [],
  vermoegenUebersicht: [],
  vermoegenEintrag: [],
  vermoegenWarnung: [],
  hinweisWeiteresFormular: [],
  hinweisVereinfachteErklaerung: [],
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
