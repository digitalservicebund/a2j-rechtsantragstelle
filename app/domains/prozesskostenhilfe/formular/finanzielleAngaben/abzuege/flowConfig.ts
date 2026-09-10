import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";

export const abzuegeFlowConfig = {
  arbeitsweg: [],
  opnvKosten: [],
  arbeitsplatzEntfernung: [],
  arbeitswegKeineRolle: [],
  arbeitsausgaben: [],
  arbeitsausgabe: [],
  arbeitsausgabenFrage: [],
  arbeitsausgabenUebersicht: [],
  arbeitsausgabenWarnung: [],
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
