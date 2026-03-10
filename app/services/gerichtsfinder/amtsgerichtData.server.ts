import courtURLs from "data/courts/sanitizedURLs.json";
import { getEncrypted } from "~/services/gerichtsfinder/encryptedStorage.server";
import {
  type Jmtd14VTErwerberPlzstrn,
  type Jmtd14VTErwerberPlzortk,
  type AngelegenheitInfo,
  ANGELEGENHEIT_INFO,
} from "~/services/gerichtsfinder/types";
import type {
  GerbehFile,
  GerbehIndex,
  PlzOrtkFile,
  PlzStrnFile,
} from "./convertJsonDataTable";
import { gerbehIndex } from "./convertJsonDataTable";

// Encrypted court data & gerbehIndex of partner courts are cached
let courtdata: Record<string, object> | undefined = undefined;

function getCourtData() {
  courtdata ??= getEncrypted();
  return courtdata;
}

const normalizeStreetName = (streetName: string) =>
  streetName
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss")
    .replaceAll(/[^a-z]/g, "_");

const courtAddress = (
  courtData: Jmtd14VTErwerberPlzstrn | Jmtd14VTErwerberPlzortk,
) => {
  const gerbehDb = getCourtData()[
    "JMTD14_VT_ERWERBER_GERBEH_DATA_TABLE.json"
  ] as GerbehFile;
  const fullCourtData = gerbehDb[gerbehIndex(buildGerbehIndex(courtData))];

  if (fullCourtData?.URL1 && fullCourtData.URL1 in courtURLs)
    fullCourtData.URL1 =
      courtURLs[fullCourtData.URL1 as keyof typeof courtURLs];

  return fullCourtData;
};

export const courtForPlz = (
  PLZ: string | undefined,
  angelegenheitInfo: AngelegenheitInfo = ANGELEGENHEIT_INFO.PROZESSKOSTENHILFE,
) => {
  const plzDb = getCourtData()["JMTD14_VT_ERWERBER_PLZORTK_DATA_TABLE.json"] as
    | PlzOrtkFile
    | undefined;
  if (!PLZ || !plzDb || !(PLZ in plzDb)) return undefined;
  return plzDb[PLZ].find(
    (court) => court.ANGELEGENHEIT_INFO === angelegenheitInfo,
  );
};

export const edgeCasesForPlz = (
  PLZ: string | undefined,
  angelegenheitInfo: AngelegenheitInfo = ANGELEGENHEIT_INFO.PROZESSKOSTENHILFE,
) => {
  const edgeCaseDb = getCourtData()[
    "JMTD14_VT_ERWERBER_PLZSTRN_DATA_TABLE.json"
  ] as PlzStrnFile | undefined;
  if (!PLZ || !edgeCaseDb || !(PLZ in edgeCaseDb)) return [];
  return edgeCaseDb[PLZ].filter(
    (edgeCase) => edgeCase.ANGELEGENHEIT_INFO === angelegenheitInfo,
  );
};

const buildGerbehIndex = (
  data: Jmtd14VTErwerberPlzstrn | Jmtd14VTErwerberPlzortk,
): GerbehIndex => {
  const isGerbeh = "GERBEH_LKZ" in data;
  return {
    LKZ: isGerbeh ? data.GERBEH_LKZ : data.LKZ,
    OLG: isGerbeh ? data.GERBEH_OLG : data.OLG,
    LG: isGerbeh ? data.GERBEH_LG : data.LG,
    AG: isGerbeh ? data.GERBEH_AG : data.AG,
    typInfo: isGerbeh ? data.GERBEH_TYP_INFO : data.TYP_INFO,
  };
};

export const findCourt = ({
  zipCode,
  streetName,
  houseNumber,
  angelegenheitInfo = ANGELEGENHEIT_INFO.PROZESSKOSTENHILFE,
}: {
  zipCode?: string;
  streetName?: string;
  houseNumber?: string;
  angelegenheitInfo?: AngelegenheitInfo;
}) => {
  if (streetName && streetName !== "default") {
    const normalizedStreetName = normalizeStreetName(streetName);
    const decodedStreetnameFull = normalizedStreetName.replaceAll(
      /(str_)/g,
      "strasse",
    );
    const edgeCases = edgeCasesForPlz(zipCode, angelegenheitInfo).map((e) => ({
      ...e,
      STRN_NORMALIZED: normalizeStreetName(e.STRN),
    }));

    const matchingEdgeCases = edgeCases.filter(
      ({ STRN_NORMALIZED }) =>
        STRN_NORMALIZED.startsWith(normalizedStreetName) ||
        STRN_NORMALIZED.startsWith(decodedStreetnameFull),
    );
    const rangedMatches = matchingEdgeCases.filter((e) => {
      const houseNumberInRange =
        Number.parseInt(e.HNR_VON) <= Number.parseInt(houseNumber!) &&
        Number.parseInt(e.HNR_BIS) >= Number.parseInt(houseNumber!);
      return houseNumberInRange;
    });
    if (rangedMatches.length === 1) return courtAddress(rangedMatches[0]);
    if (rangedMatches.length > 1) {
      const finalMatch = rangedMatches.find((e) => {
        const houseNumberEven = Number.parseInt(houseNumber!) % 2 === 0;
        return houseNumberEven
          ? e.HNR_MERKMAL_INFO === "gerade Hausnummern"
          : e.HNR_MERKMAL_INFO === "ungerade Hausnummern";
      });
      if (finalMatch) return courtAddress(finalMatch);
    }
  }

  const court = courtForPlz(zipCode, angelegenheitInfo);
  if (!court) return undefined;
  return courtAddress(court);
};
