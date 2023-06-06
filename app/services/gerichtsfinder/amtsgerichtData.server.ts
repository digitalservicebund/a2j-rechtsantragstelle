import type {
  GerbehFile,
  GerbehIndex,
  PlzOrtkFile,
  PlzStrnFile,
} from "./convertJsonDataTable";
import { gerbehIndex } from "./convertJsonDataTable";
import { loadJsonFromFile } from "~/lib/strings";

const dataDirectory = `${__dirname}/../app/services/gerichtsfinder/_data`;

export const courtAddress = (gerbeIndex: GerbehIndex) => {
  const filePath = `${dataDirectory}/JMTD14_VT_ERWERBER_GERBEH_DATA_TABLE.json`;
  const gerbehFile: GerbehFile = loadJsonFromFile(filePath);
  const key = gerbehIndex(gerbeIndex);
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
    const court = courtAddress({
      LKZ: edgeCase.LKZ,
      OLG: edgeCase.OLG,
      LG: edgeCase.LG,
      AG: edgeCase.AG,
      typInfo: edgeCase.TYP_INFO,
    });
    return { edgeCase, court };
  });
};
