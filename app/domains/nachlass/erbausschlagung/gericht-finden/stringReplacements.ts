import { type NachlassErbausschlagungGerichtFindenUserData } from "~/domains/nachlass/erbausschlagung/gericht-finden/userData";
import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { ANGELEGENHEIT_INFO } from "~/services/gerichtsfinder/types";

export const shouldUseApplicantsCourt = (
  userData: NachlassErbausschlagungGerichtFindenUserData,
) => ({
  shouldUseApplicantsCourt:
    userData.lebensmittelpunkt === "ausland" ||
    userData.ausschlagungsOrt === "courtNearMe",
});

export const getAmtsgerichtStrings = (
  userData: NachlassErbausschlagungGerichtFindenUserData,
) => {
  const zipCode =
    userData.plz ??
    userData.plzLebensmittelpunkt ??
    userData.plzHospiz ??
    userData.plzPflegeheim;
  if (!zipCode) return {};
  const court = findCourt({
    zipCode,
    streetName: userData.strasse,
    houseNumber: userData.hausnummer,
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

export const getPlzStrings = (
  userData: NachlassErbausschlagungGerichtFindenUserData,
) => ({
  plz: userData.plz,
  plzPflegeheim: userData.plzPflegeheim,
  plzHospiz: userData.plzHospiz,
  plzLebensmittelpunkt: userData.plzLebensmittelpunkt,
});
