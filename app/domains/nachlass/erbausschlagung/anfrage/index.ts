import { nachlassErbausschlagungAnfrageXStateConfig } from "~/domains/nachlass/erbausschlagung/anfrage/xStateConfig";
import type { Flow } from "~/domains/flows.server";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import {
  getArrayIndexStrings,
  getAusschlagendePersonName,
  getKinderNameSorgerecht,
  getKinderName,
  getKinderOrganizationName,
  getNumberOfKids,
  getVerstorbeneName,
  isKinderAnotherPerson,
  isKinderShared,
  getAusschlagendePersonCourtData,
  getVerstorbenenPersonCourtData,
  getMissingFilledKidNames,
  awarenessDateGreaterThan6Weeks,
  awarenessDateGreater5WeeksLessThan6Weeks,
  erblasserOutsideGermany,
} from "./stringReplacements";

export const nachlassErbausschlagungAnfrage = {
  flowType: "formFlow",
  config: nachlassErbausschlagungAnfrageXStateConfig,
  stringReplacements: (context: NachlassErbausschlagungAnfrageUserData) => ({
    ...getVerstorbeneName(context),
    ...getAusschlagendePersonName(context),
    ...getKinderName(context),
    ...getArrayIndexStrings(context),
    ...isKinderAnotherPerson(context),
    ...getKinderOrganizationName(context),
    ...getKinderNameSorgerecht(context),
    ...isKinderShared(context),
    ...getNumberOfKids(context),
    ...getAusschlagendePersonCourtData(context),
    ...getVerstorbenenPersonCourtData(context),
    ...getMissingFilledKidNames(context),
    ...awarenessDateGreaterThan6Weeks(context),
    ...awarenessDateGreater5WeeksLessThan6Weeks(context),
    ...erblasserOutsideGermany(context),
  }),
} satisfies Flow;
