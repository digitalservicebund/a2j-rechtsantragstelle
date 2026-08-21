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
  hasAnyKids,
  hasAnyAdultKids,
  hasAnyMinorKids,
  awarenessDate,
  hasVerstorbeneNotification,
} from "./stringReplacements";
import { erbausschlagungAnfrageFlowConfig } from "./flowConfig";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";

export const nachlassErbausschlagungAnfrage = {
  flowType: "formFlow",
  config: { states: {} },
  newEngineConfig: erbausschlagungAnfrageFlowConfig,
  stringReplacements: (context: NachlassErbausschlagungAnfrageUserData) => ({
    ...getVerstorbeneName(context),
    ...getAusschlagendePersonName(context),
    ...getKinderName(context),
    ...hasAnyKids(context),
    ...hasAnyMinorKids(context),
    ...hasAnyAdultKids(context),
    ...getArrayIndexStrings(context),
    ...isKinderAnotherPerson(context),
    ...getKinderOrganizationName(context),
    ...getKinderNameSorgerecht(context),
    ...isKinderShared(context),
    ...getNumberOfKids(context),
    ...getAusschlagendePersonCourtData(context),
    ...getVerstorbenenPersonCourtData(context),
    ...getMissingFilledKidNames(context),
    ...awarenessDate(context),
    ...awarenessDateGreaterThan6Weeks(context),
    ...awarenessDateGreater5WeeksLessThan6Weeks(context),
    ...erblasserOutsideGermany(context),
    ...hasVerstorbeneNotification(context),
  }),
} satisfies Flow<PageConfigMap>;
