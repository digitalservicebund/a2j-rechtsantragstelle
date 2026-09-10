import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";

export const andereUnterhaltszahlungenFlowConfig = {
  andereUnterhaltszahlungenFrage: [],
  andereUnterhaltszahlungenUebersicht: [],
  andereUnterhaltszahlungenWarnung: [],
  andereUnterhaltszahlungenPerson: [],
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
