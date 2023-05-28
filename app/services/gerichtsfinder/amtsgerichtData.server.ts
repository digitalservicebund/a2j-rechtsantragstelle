import fs from "node:fs";
import type { TypInfo } from "./types";
import type {
  GerbehFile,
  PlzOrtkFile,
  PlzStrnFile,
} from "./convertJsonDataTable";
import { gerbehIndex } from "./convertJsonDataTable";

// Cache loading JSON files even during dev live reload, see https://remix.run/docs/en/main/tutorials/jokes#connect-to-the-database
declare global {
  var jsonData: Record<string, any> | undefined;
}

function isError(error: any): error is NodeJS.ErrnoException {
  return error instanceof Error;
}

export const loadJsonFromFile = (filePath: string) => {
  if (!global.jsonData) global.jsonData = {};
  if (!global.jsonData[filePath]) {
    try {
      global.jsonData[filePath] = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (error) {
      if (!isError(error)) return;
      if (error.code === "ENOENT") {
        console.error("File not found:", error.message);
      } else {
        console.error("Error reading file:", error.message);
      }
    }
  }
  return global.jsonData[filePath] || {};
};

export const courtAddress = (
  LKZ: string,
  OLG: string,
  LG: string,
  AG: string,
  TYP_INFO: TypInfo
) => {
  const filePath = `${__dirname}/../app/services/gerichtsfinder/_data/JMTD14_VT_ERWERBER_GERBEH_DATA_TABLE.json`;
  const gerbehFile: GerbehFile = loadJsonFromFile(filePath);
  const key = gerbehIndex(LKZ, OLG, LG, AG, TYP_INFO);
  return key in gerbehFile ? gerbehFile[key] : undefined;
};

export const courtForPlz = (PLZ: string | undefined) => {
  const filePath = `${__dirname}/../app/services/gerichtsfinder/_data/JMTD14_VT_ERWERBER_PLZORTK_DATA_TABLE.json`;
  const plzFile: PlzOrtkFile = loadJsonFromFile(filePath);
  return PLZ && PLZ in plzFile ? plzFile[PLZ][0] : undefined;
};

export const edgeCasesForPlz = (PLZ: string | undefined) => {
  const filePath = `${__dirname}/../app/services/gerichtsfinder/_data/JMTD14_VT_ERWERBER_PLZSTRN_DATA_TABLE.json`;
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
