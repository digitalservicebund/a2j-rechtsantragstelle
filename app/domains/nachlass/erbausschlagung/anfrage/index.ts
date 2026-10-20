import type { Flow } from "~/domains/flows.server";
import { type ErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
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
import { erbausschlagungAnfragePdfFromUserdata } from "../../services/pdf/erbausschlagung/erbausschlagungAnfragePdfFromUserdata";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";

export const erbausschlagungAnfrage = {
  flowType: "formFlow",
  config: erbausschlagungAnfrageFlowConfig,
  stringReplacements: (context: ErbausschlagungAnfrageUserData) => ({
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
  pdfConfig: {
    pdfFunction: async (userData: ErbausschlagungAnfrageUserData) =>
      await erbausschlagungAnfragePdfFromUserdata(userData),
    name: `Erbausschlagung_Anfrage`,
  },
} satisfies Flow<PageConfigMap>;
