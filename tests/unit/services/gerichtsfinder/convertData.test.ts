import {
  conversions,
  gerbehIndex,
} from "~/services/gerichtsfinder/convertJsonDataTable";
import type { Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";

describe("data conversions", () => {
  const gerbehData: Jmtd14VTErwerberGerbeh = {
    AG: "string",
    BEZEICHNUNG: "string",
    LG: "string",
    LKZ: "string",
    OLG: "string",
    ORT: "string",
    ORTK: "string",
    PLZ_ZUSTELLBEZIRK: "string",
    STR_HNR: "string",
    TYP_INFO: "Zivilgericht - Amtsgericht",
    XML_SUPPORT: "JA",
  };

  const gerbehKey = gerbehIndex({
    LKZ: gerbehData.LKZ,
    OLG: gerbehData.OLG,
    LG: gerbehData.LG,
    AG: gerbehData.AG,
    typInfo: gerbehData.TYP_INFO,
  });

  it("handles GERBEH file", () => {
    expect(
      conversions["JMTD14_VT_ERWERBER_GERBEH_DATA_TABLE.json"]({
        JMTD14_VT_ERWERBER_GERBEH: [gerbehData],
      })
    ).toEqual({ [gerbehKey]: gerbehData });
  });
});
