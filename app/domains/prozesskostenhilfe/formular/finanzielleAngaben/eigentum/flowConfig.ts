import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";

export const eigentumFlowConfig = {
  eigentumInfo: [],
  eigentumHeiratInfo: [],
  eigentumBankkonten: [],
  eigentumBankkontenFrage: [],
  eigentumBankkontenUebersicht: [],
  eigentumBankkonto: [],
  eigentumBankkontoWarnung: [],
  eigentumGeldanlagen: [],
  eigentumGeldanlagenFrage: [],
  eigentumGeldanlagenUebersicht: [],
  eigentumGeldanlage: [],
  eigentumGeldanlagenWarnung: [],
  eigentumKraftfahrzeuge: [],
  eigentumKraftfahrzeugeFrage: [],
  eigentumKraftfahrzeugeUebersicht: [],
  eigentumKraftfahrzeug: [],
  eigentumKraftfahrzeugeWarnung: [],
  eigentumWertgegenstaende: [],
  eigentumWertgegenstaendeFrage: [],
  eigentumWertgegenstaendeUebersicht: [],
  eigentumWertgegenstand: [],
  eigentumWertgegenstaendeWarnung: [],
  eigentumGrundeigentum: [],
  eigentumGrundeigentumFrage: [],
  eigentumGrundeigentumUebersicht: [],
  eigentumGrundeigentumGrundeigentum: [],
  eigentumGrundeigentumWarnung: [],
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
