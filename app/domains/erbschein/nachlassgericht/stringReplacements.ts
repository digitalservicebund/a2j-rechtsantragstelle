import { type ErbscheinNachlassGerichtUserData } from "~/domains/erbschein/nachlassgericht/userData";
import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { buildOpenPlzResultUrl } from "~/services/gerichtsfinder/openPLZ";
import { ANGELEGENHEIT_INFO } from "~/services/gerichtsfinder/types";

export const getAmtsgerichtStrings = (
  userData: ErbscheinNachlassGerichtUserData,
) => {
  if (
    !userData.plzLebensmittelpunkt &&
    !userData.plzHospiz &&
    !userData.plzPflegeheim
  )
    return {};
  const zipCode =
    userData.plzLebensmittelpunkt ??
    userData.plzHospiz ??
    userData.plzPflegeheim;
  const court = findCourt({
    zipCode,
    streetSlug:
      userData.strasse && userData.houseNumber
        ? buildOpenPlzResultUrl(userData.strasse, userData.houseNumber)
        : undefined,
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
