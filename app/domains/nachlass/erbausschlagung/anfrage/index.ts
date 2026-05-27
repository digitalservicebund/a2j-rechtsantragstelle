import { nachlassErbausschlagungAnfrageXStateConfig } from "~/domains/nachlass/erbausschlagung/anfrage/xStateConfig";
import type { Flow } from "~/domains/flows.server";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import {
  getArrayIndexStrings,
  getAusschlagendePersonVorname,
  getKinderNameSorgerecht,
  getKinderName,
  getKinderOrganizationName,
  getNumberOfKids,
  getVerstorbeneName,
  isKinderAnotherPerson,
  isKinderShared,
  isTestamentErbvertrag,
  getAusschlagendePersonCourtData,
  getVerstorbenenPersonCourtData,
} from "./stringReplacements";

export const nachlassErbausschlagungAnfrage = {
  flowType: "formFlow",
  config: nachlassErbausschlagungAnfrageXStateConfig,
  stringReplacements: (context: NachlassErbausschlagungAnfrageUserData) => ({
    ...getVerstorbeneName(context),
    ...getAusschlagendePersonVorname(context),
    ...isTestamentErbvertrag(context),
    ...getKinderName(context),
    ...getArrayIndexStrings(context),
    ...isKinderAnotherPerson(context),
    ...getKinderOrganizationName(context),
    ...getKinderNameSorgerecht(context),
    ...isKinderShared(context),
    ...getNumberOfKids(context),
    ...getAusschlagendePersonCourtData(context),
    ...getVerstorbenenPersonCourtData(context),
  }),
} satisfies Flow;
