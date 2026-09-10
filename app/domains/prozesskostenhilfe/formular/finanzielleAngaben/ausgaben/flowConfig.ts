import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";

export const ausgabenFlowConfig = {
  ausgabenFrage: [],
  ausgabenVersicherungenFrage: [],
  ausgabenVersicherungenUebersicht: [],
  ausgabenVersicherungenWarnung: [],
  ausgabenVersicherung: [],
  ausgabenRatenzahlungenFrage: [],
  ausgabenRatenzahlungenUebersicht: [],
  ausgabenRatenzahlungenWarnung: [],
  ausgabenRatenzahlung: [],
  ausgabenSonstigeAusgabenFrage: [],
  ausgabenSonstigeAusgabenUebersicht: [],
  ausgabenSonstigeAusgabenWarnung: [],
  ausgabenSonstigeAusgabe: [],
  ausgabenBesondereBelastungen: [],
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
