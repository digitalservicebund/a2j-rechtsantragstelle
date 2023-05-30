import type { TypInfo } from "./types";
import type {
  GerbehFile,
  PlzOrtkFile,
  PlzStrnFile,
} from "./convertJsonDataTable";
import { gerbehIndex } from "./convertJsonDataTable";
import { loadJsonFromFile } from "~/lib/strings";

// Cache loading JSON files even during dev live reload, see https://remix.run/docs/en/main/tutorials/jokes#connect-to-the-database
declare global {
  var jsonData: Record<string, any> | undefined;
}
const dataDirectory = `${__dirname}/../app/services/gerichtsfinder/_data`;

export const courtAddress = (
  LKZ: string,
  OLG: string,
  LG: string,
  AG: string,
  TYP_INFO: TypInfo
) => {
  const filePath = `${dataDirectory}/JMTD14_VT_ERWERBER_GERBEH_DATA_TABLE.json`;
  const gerbehFile: GerbehFile = loadJsonFromFile(filePath);
  const key = gerbehIndex(LKZ, OLG, LG, AG, TYP_INFO);
  return key in gerbehFile ? gerbehFile[key] : undefined;
};

export const courtForPlz = (PLZ: string | undefined) => {
  const filePath = `${dataDirectory}/JMTD14_VT_ERWERBER_PLZORTK_DATA_TABLE.json`;
  const plzFile: PlzOrtkFile = loadJsonFromFile(filePath);
  return PLZ && PLZ in plzFile ? plzFile[PLZ][0] : undefined;
};

export const edgeCasesForPlz = (PLZ: string | undefined) => {
  const filePath = `${dataDirectory}/JMTD14_VT_ERWERBER_PLZSTRN_DATA_TABLE.json`;
  const edgeCaseFile: PlzStrnFile = loadJsonFromFile(filePath);

  const edgeCases = PLZ && PLZ in edgeCaseFile ? edgeCaseFile[PLZ] : [];
  return edgeCases.map((edgeCase) => {
    const court = courtAddress(
      edgeCase.LKZ,
      edgeCase.OLG,
      edgeCase.LG,
      edgeCase.AG,
      edgeCase.TYP_INFO
    );
    return { edgeCase, court };
  });
};
