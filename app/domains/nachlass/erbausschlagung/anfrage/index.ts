import { nachlassErbausschlagungAnfrageXStateConfig } from "~/domains/nachlass/erbausschlagung/anfrage/xStateConfig";
import type { Flow } from "~/domains/flows.server";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import {
  getArrayIndexStrings,
  getAusschlagendePersonVorname,
  getKinderNameSorgerechtUnder18,
  getKinderNameUnder18,
  getKinderOrganizationNameUnder18,
  getVerstorbeneName,
  isKinderUnder18AnotherPerson,
  isTestamentErbvertrag,
} from "./stringReplacements";

export const nachlassErbausschlagungAnfrage = {
  flowType: "formFlow",
  config: nachlassErbausschlagungAnfrageXStateConfig,
  stringReplacements: (context: NachlassErbausschlagungAnfrageUserData) => ({
    ...getVerstorbeneName(context),
    ...getAusschlagendePersonVorname(context),
    ...isTestamentErbvertrag(context),
    ...getKinderNameUnder18(context),
    ...getArrayIndexStrings(context),
    ...isKinderUnder18AnotherPerson(context),
    ...getKinderOrganizationNameUnder18(context),
    ...getKinderNameSorgerechtUnder18(context),
  }),
} satisfies Flow;
