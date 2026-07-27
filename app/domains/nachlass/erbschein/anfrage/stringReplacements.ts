import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { firstArrayIndex } from "~/services/flow/pageDataSchema";
import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { ANGELEGENHEIT_INFO } from "~/services/gerichtsfinder/types";

export const getVerstorbeneName = (
  context: NachlassErbscheinAnfrageUserData,
) => {
  return {
    verstorbeneName: `${context.verstorbeneVorname} ${context.verstorbeneNachname}`,
  };
};

export const getVerstorbeneStreetnameHousenumber = (
  context: NachlassErbscheinAnfrageUserData,
) => ({
  verstorbeneStreetnameHousenumber: `${context.verstorbenePersonStrasse} ${context.verstorbenePersonHausnummer}`,
});

export const getVerstorbenePostcodeCity = (
  context: NachlassErbscheinAnfrageUserData,
) => ({
  verstorbenePostcodeCity: `${context.verstorbenePlz} ${context.verstorbenePersonOrt}`,
});

export const getEhepartnerName = (
  context: NachlassErbscheinAnfrageUserData,
) => {
  return {
    ehepartnerName: `${context.ehepartnerVorname} ${context.ehepartnerNachname}`,
  };
};

export const getBeguenstigteStrings = (
  context: NachlassErbscheinAnfrageUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (
    arrayIndex === undefined ||
    !context.beguenstigten ||
    arrayIndex > context.beguenstigten.length + 1
  )
    return {};
  if (arrayIndex < context.beguenstigten.length)
    return {
      "beguenstigten#vorname": context.beguenstigten?.[arrayIndex].vorname,
      "beguenstigten#nachname": context.beguenstigten?.[arrayIndex].nachname,
    };
};

export const getAmtsgerichtStrings = (
  userData: NachlassErbscheinAnfrageUserData,
) => {
  const zipCode =
    userData.verstorbenePlz ??
    userData.verstorbeneHospizPlz ??
    userData.verstorbenePflegeheimPlz;
  if (!zipCode) return {};
  const court = findCourt({
    zipCode,
    streetName: userData.verstorbenePersonStrasse,
    houseNumber: userData.verstorbenePersonHausnummer,
    angelegenheitInfo: ANGELEGENHEIT_INFO.NACHLASSSACHEN,
  });
  return {
    courtName: court?.BEZEICHNUNG,
    courtStreetNumber: court?.STR_HNR,
    courtPlz: court?.PLZ_ZUSTELLBEZIRK,
    courtOrt: court?.ORT,
    courtWebsite: court?.URL1,
    courtTelephone: court?.TEL,
  };
};

export const getAngehoerigeStrings = (
  context: NachlassErbscheinAnfrageUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (
    arrayIndex === undefined ||
    !context.angehoerige ||
    arrayIndex > context.angehoerige.length + 1
  )
    return {};
  if (arrayIndex < context.angehoerige.length)
    return {
      angehoerigeName: `${context.angehoerige?.[arrayIndex].vorname} ${context.angehoerige?.[arrayIndex].nachname}`,
    };
};
