import { firstArrayIndex } from "~/services/flow/pageDataSchema";
import { type NachlassErbausschlagungAnfrageUserData } from "./userData";
import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { ANGELEGENHEIT_INFO } from "~/services/gerichtsfinder/types";
import { erbausschlagungKinderArraySchema } from "~/domains/nachlass/erbausschlagung/anfrage/kinder/pages";

export const getVerstorbeneName = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  return {
    verstorbeneName: `${context.verstorbeneVorname} ${context.verstorbeneNachname}`,
  };
};

export const getAusschlagendePersonVorname = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  return {
    ausschlagendePersonVorname: `${context.ausschlagendePersonVorname} ${context.ausschlagendePersonNachname}`,
  };
};

export const isTestamentErbvertrag = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  return {
    isTestamentErbvertrag: context.testament === "erbvertrag",
  };
};

export const getKinderName = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (
    arrayIndex === undefined ||
    !context.kinder ||
    arrayIndex > context.kinder.length + 1
  )
    return {};
  if (arrayIndex < context.kinder.length)
    return {
      kinderName: `${context.kinder?.[arrayIndex].vorname} ${context.kinder?.[arrayIndex].nachname}`,
    };
};

export const getKinderOrganizationName = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (
    arrayIndex === undefined ||
    !context.kinder ||
    arrayIndex > context.kinder.length + 1
  )
    return {};
  if (arrayIndex < context.kinder.length)
    return {
      kinderOrganization:
        context.kinder?.[arrayIndex].organizationNameSorgerecht,
    };
};

export const getKinderNameSorgerecht = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (
    arrayIndex === undefined ||
    !context.kinder ||
    arrayIndex > context.kinder.length + 1
  )
    return {};
  if (arrayIndex < context.kinder.length)
    return {
      kinderNameSorgerecht: `${context.kinder?.[arrayIndex].vornameSorgerecht} ${context.kinder?.[arrayIndex].nachnameSorgerecht}`,
    };
};

export const isKinderAnotherPerson = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (
    arrayIndex === undefined ||
    !context.kinder ||
    arrayIndex > context.kinder.length + 1
  )
    return { isKinderAnotherPerson: false };
  if (arrayIndex < context.kinder.length)
    return {
      isKinderAnotherPerson:
        context.kinder?.[arrayIndex].optionSorgerecht === "anotherPerson",
    };
};

export const isKinderShared = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (
    arrayIndex === undefined ||
    !context.kinder ||
    arrayIndex > context.kinder.length + 1
  )
    return { isKinderShared: false };
  if (arrayIndex < context.kinder.length)
    return {
      isKinderShared:
        context.kinder?.[arrayIndex].optionSorgerecht === "shared",
    };
};

export const getNumberOfKids = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  return {
    numberOfKidsAdded: (context.kinder?.length ?? 0).toString(),
    numberOfKids: (context.numberOfKids ?? 0).toString(),
    hasOneKid: context.numberOfKids === 1,
    hasOneKidAdded: context.kinder?.length === 1,
  };
};

export const getArrayIndexStrings = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  return arrayIndex === undefined
    ? {}
    : { "array#index": String(arrayIndex + 1) };
};

export const getAusschlagendePersonCourtData = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  const ausschlagendePersonCourt = findCourt({
    zipCode: context.ausschlagendePersonPlz,
    streetName: context.ausschlagendePersonStrasse,
    houseNumber: context.ausschlagendePersonHausnummer,
  });

  return {
    ausschlagendePersonCourtName: ausschlagendePersonCourt?.BEZEICHNUNG,
    ausschlagendePersonCourtStreetNumber: ausschlagendePersonCourt?.STR_HNR,
    ausschlagendePersonCourtPlz: ausschlagendePersonCourt?.PLZ_ZUSTELLBEZIRK,
    ausschlagendePersonCourtOrt: ausschlagendePersonCourt?.ORT,
    ausschlagendePersonCourtWebsite: ausschlagendePersonCourt?.URL1,
    ausschlagendePersonCourtTelephone: ausschlagendePersonCourt?.TEL,
  };
};

export const getMissingFilledKidNames = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  if (!context.kinder || context.kinder.length === 0) return {};

  return {
    missingFilledKidNames: context.kinder
      .filter(
        (kid) => !erbausschlagungKinderArraySchema.safeParse([kid]).success,
      )
      .map((kid) => `${kid.vorname} ${kid.nachname}`),
  };
};

export const getVerstorbenenPersonCourtData = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  if (context.verstorbeneLebensmittelpunkt === "ausland") {
    return {};
  }

  const verstorbenePersonCourt = findCourt({
    zipCode:
      context.plzBeforeHospiz ??
      context.plzPflegeheim ??
      context.plzVerstorbene,
    streetName: context.verstorbeneAdresseStrasse,
    houseNumber: context.verstorbeneAdresseHausnummer,
    angelegenheitInfo: ANGELEGENHEIT_INFO.NACHLASSSACHEN,
  });

  return {
    verstorbenePersonCourtName: verstorbenePersonCourt?.BEZEICHNUNG,
    verstorbenePersonCourtStreetNumber: verstorbenePersonCourt?.STR_HNR,
    verstorbenePersonCourtPlz: verstorbenePersonCourt?.PLZ_ZUSTELLBEZIRK,
    verstorbenePersonCourtOrt: verstorbenePersonCourt?.ORT,
    verstorbenePersonCourtWebsite: verstorbenePersonCourt?.URL1,
    verstorbenePersonCourtTelephone: verstorbenePersonCourt?.TEL,
  };
};
