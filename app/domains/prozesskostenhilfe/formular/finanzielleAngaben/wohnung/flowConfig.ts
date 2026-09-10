import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "../../pages";

export const wohnungFlowConfig = {
  wohnungAlleineZusammen: [],
  wohnungAnzahlMitbewohner: [],
  wohnungGroesse: [],
  wohnungAnzahlZimmer: [],
  wohnungMieteEigenheim: [],
  wohnungMieteAlleine: [],
  wohnungMieteZusammen: [],
  wohnungGarageParkplatz: [],
  wohnungNebenkosten: [],
  wohnungEigenheimNebenkosten: [],
  wohnungEigenheimNebenkostenGeteilt: [],
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
