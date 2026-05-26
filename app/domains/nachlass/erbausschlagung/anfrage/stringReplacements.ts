import { firstArrayIndex } from "~/services/flow/pageDataSchema";
import { type NachlassErbausschlagungAnfrageUserData } from "./userData";

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
