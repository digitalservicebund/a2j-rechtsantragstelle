import { type ErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { erbfolgeStringReplacements } from "~/domains/nachlass/erbschein/shared/stringReplacements";
import { firstArrayIndex } from "~/services/flow/pageData";
import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { ANGELEGENHEIT_INFO } from "~/services/gerichtsfinder/types";
import { type Replacements } from "~/util/applyStringReplacement";

export const getVerstorbeneName = (context: ErbscheinAnfrageUserData) => {
  return {
    verstorbeneName: `${context.verstorbeneVorname} ${context.verstorbeneNachname}`,
  };
};

export const getVerstorbeneStreetnameHousenumber = (
  context: ErbscheinAnfrageUserData,
) => ({
  verstorbeneStreetnameHousenumber:
    context.verstorbeneLebensmittelpunkt === "deutschland"
      ? `${context.verstorbenePersonStrasse} ${context.verstorbenePersonHausnummer}`
      : `${context.verstorbenePersonAuslaendischeStrasse} ${context.verstorbenePersonAuslaendischeHausnummer}`,
});

export const getVerstorbenePostcodeCity = (
  context: ErbscheinAnfrageUserData,
) => {
  let plz: string;
  if (context.verstorbeneLivedInPflegeheim == "yes") {
    plz = context.verstorbenePflegeheimPlz ?? "";
  } else if (context.verstorbeneLivedInHospiz == "yes") {
    plz = context.verstorbeneHospizPlz ?? "";
  } else {
    plz = context.verstorbenePlz ?? "";
  }
  return {
    verstorbenePostcodeCity:
      context.verstorbeneLebensmittelpunkt === "deutschland"
        ? `${plz} ${context.verstorbenePersonOrt}`
        : `${context.verstorbenePersonAuslaendischePlz} ${context.verstorbenePersonAuslaendischerOrt} (${context.verstorbenePersonLand})`,
  };
};

export const getEhepartnerName = (context: ErbscheinAnfrageUserData) => {
  return {
    ehepartnerName: `${context.ehepartnerVorname} ${context.ehepartnerNachname}`,
  };
};

export const getBeguenstigteStrings = (context: ErbscheinAnfrageUserData) => {
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

export const getVerstorbenePersonCourtStrings = (
  userData: ErbscheinAnfrageUserData,
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

export const getAntragstellendePersonCourtStrings = (
  userData: ErbscheinAnfrageUserData,
) => {
  const court = findCourt({
    zipCode: userData.antragstellendePersonPlz,
    streetName: userData.antragstellendePersonStrasse,
    houseNumber: userData.antragstellendePersonHausnummer,
    angelegenheitInfo: ANGELEGENHEIT_INFO.NACHLASSSACHEN,
  });
  return {
    antragstellendePersonCourtName: court?.BEZEICHNUNG,
    antragstellendePersonCourtStreetNumber: court?.STR_HNR,
    antragstellendePersonCourtPlz: court?.PLZ_ZUSTELLBEZIRK,
    antragstellendePersonCourtOrt: court?.ORT,
    antragstellendePersonCourtWebsite: court?.URL1,
    antragstellendePersonCourtTelephone: court?.TEL,
  };
};

const angehoerigeName = (context: ErbscheinAnfrageUserData) => {
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

export const getAngehoerigeStrings = (
  context: ErbscheinAnfrageUserData,
): Replacements => {
  return {
    ...angehoerigeName(context),
    ...erbfolgeStringReplacements(context),
  };
};
