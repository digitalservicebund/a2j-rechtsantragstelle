import { nachlassErbausschlagungAnfrageXStateConfig } from "~/domains/nachlass/erbausschlagung/anfrage/xStateConfig";
import type { Flow } from "~/domains/flows.server";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";

export const nachlassErbausschlagungAnfrage = {
  flowType: "formFlow",
  config: nachlassErbausschlagungAnfrageXStateConfig,
  stringReplacements: (context: NachlassErbausschlagungAnfrageUserData) => ({
    verstorbeneName: `${context.verstorbeneVorname} ${context.verstorbeneNachname}`,
    ausschlagendePersonVorname: `${context.ausschlagendePersonVorname} ${context.ausschlagendePersonNachname}`,
    isTestamentErbvertrag: context.testament === "erbvertrag",
  }),
} satisfies Flow;
