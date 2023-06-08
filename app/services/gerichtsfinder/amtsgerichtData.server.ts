import type {
  GerbehFile,
  GerbehIndex,
  PlzOrtkFile,
  PlzStrnFile,
} from "./convertJsonDataTable";
import { gerbehIndex } from "./convertJsonDataTable";
import { getEncrypted } from "./encryptedStorage";

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
  const edgeCases = PLZ && PLZ in edgeCaseDb ? edgeCaseDb[PLZ] : [];
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
