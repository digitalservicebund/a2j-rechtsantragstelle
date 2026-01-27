import { ErbscheinNachlassGerichtUserData } from "./userData";

export const getAmtsgerichtStrings = (
  context: ErbscheinNachlassGerichtUserData,
) => {
  // TODO: Replace with real lookup
  const court = {
    BEZEICHNUNG: "Amtsgericht Musterstadt",
    STR_HNR: "Musterstraße 1",
    PLZ_ZUSTELLBEZIRK: "12345",
    ORT: "Musterstadt",
    URL1: "https://www.amtsgericht-musterstadt.de",
    TEL: "01234 567890",
  };
  return {
    courtName: court?.BEZEICHNUNG,
    courtStreetNumber: court?.STR_HNR,
    courtPlz: court?.PLZ_ZUSTELLBEZIRK,
    courtOrt: court?.ORT,
    courtWebsite: court?.URL1,
    courtTelephone: court?.TEL,
  };
};
