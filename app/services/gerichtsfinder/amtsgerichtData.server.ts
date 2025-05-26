import uniqBy from "lodash/uniqBy";
import partnerGerichte from "data/courts/partnerGerichte.json";
import courtURLs from "data/courts/sanitizedURLs.json";
import { getEncrypted } from "~/services/gerichtsfinder/encryptedStorage.server";
import {
  type Jmtd14VTErwerberPlzstrn,
  type Jmtd14VTErwerberPlzortk,
} from "~/services/gerichtsfinder/types";
import { stripLeadingZeros, uppercaseFirstLetter } from "~/util/strings";
import type {
  GerbehFile,
  GerbehIndex,
  PlzOrtkFile,
  PlzStrnFile,
} from "./convertJsonDataTable";
import { gerbehIndex } from "./convertJsonDataTable";

// Encrypted court data & gerbehIndex of partner courts are cached
let courtdata: Record<string, object> | undefined = undefined;
let partnerCourtsGerbehIndex: Record<string, object> | undefined = undefined;

const OPENPLZ_URL = "https://openplzapi.org/de";

type OpenPLZResult = {
  name: string;
  postalCode: string;
  locality: string;
  borough: string;
  suburb: string;
  municipality: {
    key: string;
    name: string;
    type: string;
  };
  federalState: {
    key: string;
    name: string;
  };
};

function getCourtData() {
  courtdata ??= getEncrypted();
  return courtdata;
}

function getPartnerCourtsGerbehIndex() {
  partnerCourtsGerbehIndex ??= Object.fromEntries(
    Object.entries(partnerGerichte).map(([courtPostcode, courtInfos]) => [
      gerbehIndexForPlz(courtPostcode),
      courtInfos,
    ]),
  );
  return partnerCourtsGerbehIndex;
}

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

export const courtForPlz = (PLZ: string | undefined) => {
  const plzDb = getCourtData()[
    "JMTD14_VT_ERWERBER_PLZORTK_DATA_TABLE.json"
  ] as PlzOrtkFile;
  return PLZ && plzDb && PLZ in plzDb ? plzDb[PLZ][0] : undefined;
};

export const edgeCasesForPlz = (PLZ: string | undefined) => {
  const edgeCaseDb = getCourtData()[
    "JMTD14_VT_ERWERBER_PLZSTRN_DATA_TABLE.json"
  ] as PlzStrnFile;
  return PLZ && PLZ in edgeCaseDb ? edgeCaseDb[PLZ] : [];
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

type StreetData = Pick<
  Jmtd14VTErwerberPlzstrn,
  "HNR_MERKMAL_INFO" | "HNR_VON" | "HNR_BIS" | "STRN"
>;

const buildStreetSlug = (streetData: StreetData) => {
  return `${streetData.STRN} ${streetData.HNR_MERKMAL_INFO} ${streetData.HNR_VON} ${streetData.HNR_BIS}`
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/[^0-9a-z]/g, "-")
    .replace("-fortlaufende-hausnummern-001-999", "");
};

const capitalizeStreet = (street: string) => {
  const capitalizeWord = (word: string) =>
    word.split("-").map(uppercaseFirstLetter).join("-");
  return street.toLowerCase().split(/\s/).map(capitalizeWord).join(" ");
};

function streetForEdgeCase(streetData: StreetData) {
  const streetNumbers = `(${
    streetData.HNR_MERKMAL_INFO
  } von ${stripLeadingZeros(streetData.HNR_VON)} bis ${stripLeadingZeros(
    streetData.HNR_BIS,
  )})`;
  const street = `${capitalizeStreet(streetData.STRN)} ${streetNumbers}`;
  return { street, slug: buildStreetSlug(streetData) };
}

export const edgeCaseStreets = ({ zipCode }: { zipCode?: string }) => {
  return edgeCasesForPlz(zipCode).map(streetForEdgeCase);
};

const gerbehIndexForPlz = (zipCode: string) => {
  const court = courtForPlz(zipCode);
  return court ? gerbehIndex(buildGerbehIndex(court)) : undefined;
};

export const findCourt = ({
  zipCode,
  streetSlug,
  houseNumber,
}: {
  zipCode: string;
  streetSlug?: string;
  houseNumber?: string;
}) => {
  if (streetSlug && streetSlug !== "default") {
    const decodedStreetName = streetSlug
      .replaceAll(/_/g, " ")
      .replaceAll(/([Ss]tr\.)/g, "strasse");
    const edgeCases = edgeCasesForPlz(zipCode);
    const matchingEdgeCases = edgeCases.filter((e) =>
      e.STRN.toLowerCase()
        .replace(/ä/g, "ae")
        .replace(/ö/g, "oe")
        .replace(/ü/g, "ue")
        .startsWith(decodedStreetName),
    );
    const rangedMatches = matchingEdgeCases.filter((e) => {
      const houseNumberInRange =
        parseInt(e.HNR_VON) <= parseInt(houseNumber!) &&
        parseInt(e.HNR_BIS) >= parseInt(houseNumber!);
      return houseNumberInRange;
    });
    if (rangedMatches.length === 1) return courtAddress(rangedMatches[0]);
    if (rangedMatches.length > 1) {
      const finalMatch = rangedMatches.find((e) => {
        const houseNumberEven = parseInt(houseNumber!) % 2 === 0;
        return houseNumberEven
          ? e.HNR_MERKMAL_INFO === "gerade Hausnummern"
          : e.HNR_MERKMAL_INFO === "ungerade Hausnummern";
      });
      if (finalMatch) return courtAddress(finalMatch);
    }
  }

  const court = courtForPlz(zipCode);
  if (!court) return undefined;
  return courtAddress(court);
};

export function findCourtIfUnique(zipCode?: string) {
  if (!zipCode) return undefined;
  const court = findCourt({ zipCode });
  if (court && edgeCasesForPlz(zipCode).length == 0) {
    return court;
  }
}

export function isPartnerCourt(zipCode?: string) {
  const partnerCourtGerbehIndices = getPartnerCourtsGerbehIndex();
  if (!zipCode || !partnerCourtGerbehIndices) return false;
  const gerbehIndex = gerbehIndexForPlz(zipCode);
  return gerbehIndex !== undefined && gerbehIndex in partnerCourtGerbehIndices;
}

export async function fetchOpenPLZData(
  zipCode: string,
  searchTerm?: string,
  page = 1,
) {
  const queryString = searchTerm ? `name=^${searchTerm}&` : "";
  const openPlzResponse = await fetch(
    OPENPLZ_URL +
      `/Streets?${queryString}postalCode=${zipCode}&page=${page.toString()}&pageSize=50`,
  );
  if (!openPlzResponse.ok) {
    throw new Error(
      `OpenPLZ Error: ${openPlzResponse.status} ${openPlzResponse.statusText}`,
    );
  }
  return uniqBy((await openPlzResponse.json()) as OpenPLZResult[], "name");
}
