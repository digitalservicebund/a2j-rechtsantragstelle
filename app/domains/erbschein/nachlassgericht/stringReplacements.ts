import { type ErbscheinNachlassGerichtUserData } from "~/domains/erbschein/nachlassgericht/userData";
import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { ANGELEGENHEIT_INFO } from "~/services/gerichtsfinder/types";

export const getAmtsgerichtStrings = (
  userData: ErbscheinNachlassGerichtUserData,
) => {
  const zipCode =
    userData.plzLebensmittelpunkt ??
    userData.plzHospiz ??
    userData.plzPflegeheim;
  if (!zipCode) return {};
  const court = findCourt({
    zipCode,
    streetSlug: userData.strasse,
    houseNumber: userData.houseNumber,
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
