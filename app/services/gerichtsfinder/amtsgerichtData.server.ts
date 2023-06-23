import { stripLeadingZeros } from "~/util/strings";
import type {
  GerbehFile,
  GerbehIndex,
  PlzOrtkFile,
  PlzStrnFile,
} from "./convertJsonDataTable";
import { gerbehIndex } from "./convertJsonDataTable";
import { getEncrypted } from "./encryptedStorage";
import type { Jmtd14VTErwerberPlzortk, Jmtd14VTErwerberPlzstrn } from "./types";

const data = getEncrypted();

export const courtAddress = (index: GerbehIndex) => {
  const gerbehDb: GerbehFile =
    data["JMTD14_VT_ERWERBER_GERBEH_DATA_TABLE.json"];
  const key = gerbehIndex(index);
  return key in gerbehDb ? gerbehDb[key] : undefined;
};

export const courtForPlz = (PLZ: string | undefined) => {
  const plzDb: PlzOrtkFile = data["JMTD14_VT_ERWERBER_PLZORTK_DATA_TABLE.json"];
  return PLZ && plzDb && PLZ in plzDb ? plzDb[PLZ][0] : undefined;
};

export const edgeCasesForPlz = (PLZ: string | undefined) => {
  const edgeCaseDb: PlzStrnFile =
    data["JMTD14_VT_ERWERBER_PLZSTRN_DATA_TABLE.json"];
  return PLZ && PLZ in edgeCaseDb ? edgeCaseDb[PLZ] : [];
};

const buildGerbehIndex = (
  data: Jmtd14VTErwerberPlzstrn | Jmtd14VTErwerberPlzortk
) => {
  return {
    LKZ:
      (data as Jmtd14VTErwerberPlzortk).GERBEH_LKZ ??
      (data as Jmtd14VTErwerberPlzstrn).LKZ,
    OLG:
      (data as Jmtd14VTErwerberPlzortk).GERBEH_OLG ??
      (data as Jmtd14VTErwerberPlzstrn).OLG,
    LG:
      (data as Jmtd14VTErwerberPlzortk).GERBEH_LG ??
      (data as Jmtd14VTErwerberPlzstrn).LG,
    AG:
      (data as Jmtd14VTErwerberPlzortk).GERBEH_AG ??
      (data as Jmtd14VTErwerberPlzstrn).AG,
    typInfo:
      (data as Jmtd14VTErwerberPlzortk).GERBEH_TYP_INFO ??
      (data as Jmtd14VTErwerberPlzstrn).TYP_INFO,
  };
};

export const buildStreetSlug = ({
  HNR_VON,
  HNR_BIS,
  STRN,
  HNR_MERKMAL_INFO,
}: Jmtd14VTErwerberPlzstrn) => {
  return `${STRN} ${HNR_MERKMAL_INFO} ${HNR_VON} ${HNR_BIS}`
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/[^0-9a-z]/g, "-")
    .replace("-fortlaufende-hausnummern-001-999", "");
};

const capitalizeStreet = (street: string) => {
  const capitalizeSimpleWord = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);
  const capitalizeWord = (word: string) =>
    word.split("-").map(capitalizeSimpleWord).join("-");
  return street.toLowerCase().split(/\s/).map(capitalizeWord).join(" ");
};

export const decorateEdgeCase = (edgeCase: Jmtd14VTErwerberPlzstrn) => {
  const street = capitalizeStreet(edgeCase.STRN);
  const numbers = `(${edgeCase.HNR_MERKMAL_INFO} von ${stripLeadingZeros(
    edgeCase.HNR_VON
  )} bis ${stripLeadingZeros(edgeCase.HNR_BIS)})`;
  const allNumbers = numbers === "(fortlaufende Hausnummern von 1 bis 999)";

  return {
    ...edgeCase,
    street: allNumbers ? street : `${street} ${numbers}`,
    streetSlug: buildStreetSlug(edgeCase),
  };
};

export const findEdgeCases = ({ zipCode }: { zipCode?: string }) => {
  return edgeCasesForPlz(zipCode).map(decorateEdgeCase);
};

export const findCourt = ({
  zipCode,
  streetSlug,
}: {
  zipCode: string;
  streetSlug?: string;
}) => {
  if (streetSlug && streetSlug !== "default") {
    const edgeCases = edgeCasesForPlz(zipCode);
    const edgeCase = edgeCases.find((e) => buildStreetSlug(e) === streetSlug);
    if (!edgeCase) throw new Error("streetSlug unknown");
    return courtAddress(buildGerbehIndex(edgeCase));
  }

  const court = courtForPlz(zipCode);
  if (!court) throw new Error("zipCode unknown");
  return courtAddress(buildGerbehIndex(court));
};
