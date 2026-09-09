import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";

export const einkuenfteFlowConfig = {
  einkuenfteStart: [],
  staatlicheLeistungen: [],
  buergergeld: [],
  arbeitslosengeld: [],
  erwerbstaetig: [],
  art: [],
  nettoEinkommen: [],
  selbststaendig: [],
  selbststaendigAbzuege: [],
  renteFrage: [],
  rente: [],
  leistungenFrage: [],
  wohngeld: [],
  krankengeld: [],
  elterngeld: [],
  kindergeld: [],
  weitereEinkuenfte: [],
  weitereEinkunft: [],
  weitereEinkuenfteFrage: [],
  weitereEinkuenfteUebersicht: [],
  weitereEinkuenfteWarnung: [],
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
