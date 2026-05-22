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

export const getKinderNameUnder18 = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (
    arrayIndex === undefined ||
    !context.kinderUnder18 ||
    arrayIndex > context.kinderUnder18.length + 1
  )
    return {};
  if (arrayIndex < context.kinderUnder18.length)
    return {
      kinderNameUnder18: `${context.kinderUnder18?.[arrayIndex].vorname} ${context.kinderUnder18?.[arrayIndex].nachname}`,
    };
};

export const getKinderOrganizationNameUnder18 = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (
    arrayIndex === undefined ||
    !context.kinderUnder18 ||
    arrayIndex > context.kinderUnder18.length + 1
  )
    return {};
  if (arrayIndex < context.kinderUnder18.length)
    return {
      kinderOrganizationUnder18:
        context.kinderUnder18?.[arrayIndex].organizationNameSorgerecht,
    };
};

export const getKinderNameSorgerechtUnder18 = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (
    arrayIndex === undefined ||
    !context.kinderUnder18 ||
    arrayIndex > context.kinderUnder18.length + 1
  )
    return {};
  if (arrayIndex < context.kinderUnder18.length)
    return {
      kinderNameSorgerechtUnder18: `${context.kinderUnder18?.[arrayIndex].vornameSorgerecht} ${context.kinderUnder18?.[arrayIndex].nachnameSorgerecht}`,
    };
};

export const isKinderUnder18AnotherPerson = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (
    arrayIndex === undefined ||
    !context.kinderUnder18 ||
    arrayIndex > context.kinderUnder18.length + 1
  )
    return { isKinderUnder18AnotherPerson: false };
  if (arrayIndex < context.kinderUnder18.length)
    return {
      isKinderUnder18AnotherPerson:
        context.kinderUnder18?.[arrayIndex].optionSorgerecht ===
        "anotherPerson",
    };
};

export const isKinderUnder18Shared = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (
    arrayIndex === undefined ||
    !context.kinderUnder18 ||
    arrayIndex > context.kinderUnder18.length + 1
  )
    return { isKinderUnder18Shared: false };
  if (arrayIndex < context.kinderUnder18.length)
    return {
      isKinderUnder18Shared:
        context.kinderUnder18?.[arrayIndex].optionSorgerecht === "shared",
    };
};

export const getNumberOfKids = (
  context: NachlassErbausschlagungAnfrageUserData,
) => {
  return {
    numberOfKidsUnder18Added: (context.kinderUnder18?.length ?? 0).toString(),
    numberOfKidsUnder18: (context.numberOfKidsUnder18 ?? 0).toString(),
    numberOfKidsOver18: (context.numberOfKidsOver18 ?? 0).toString(),
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
