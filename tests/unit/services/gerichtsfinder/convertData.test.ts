import {
  conversions,
  gerbehIndex,
} from "~/services/gerichtsfinder/convertJsonDataTable";
import type {
  Jmtd14VTErwerberGerbeh,
  Jmtd14VTErwerberPlzortk,
  Jmtd14VTErwerberPlzstrn,
} from "~/services/gerichtsfinder/types";

describe("gerbeh data conversions", () => {
  const gerbehAmtsgericht: Jmtd14VTErwerberGerbeh = {
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

  const gerbehAmtsgerichtKey = gerbehIndex({
    LKZ: gerbehAmtsgericht.LKZ,
    OLG: gerbehAmtsgericht.OLG,
    LG: gerbehAmtsgericht.LG,
    AG: gerbehAmtsgericht.AG,
    typInfo: gerbehAmtsgericht.TYP_INFO,
  });

  it("handles valid Gerbeh data", () => {
    expect(
      conversions["JMTD14_VT_ERWERBER_GERBEH_DATA_TABLE.json"]({
        JMTD14_VT_ERWERBER_GERBEH: [gerbehAmtsgericht],
      })
    ).toEqual({ [gerbehAmtsgerichtKey]: gerbehAmtsgericht });
  });

  it("filters non-amtsgericht Gerbeh content", () => {
    let nonAmtsgericht = { ...gerbehAmtsgericht };
    nonAmtsgericht.TYP_INFO = "Arbeitsgericht";

    expect(
      conversions["JMTD14_VT_ERWERBER_GERBEH_DATA_TABLE.json"]({
        JMTD14_VT_ERWERBER_GERBEH: [gerbehAmtsgericht, nonAmtsgericht],
      })
    ).toEqual({ [gerbehAmtsgerichtKey]: gerbehAmtsgericht });
  });
});

describe("PlzOrtk data conversions", () => {
  const plzOrtkEntry: Jmtd14VTErwerberPlzortk = {
    ANGELEGENHEIT_INFO: "Prozesskostenhilfe eingehend",
    GERBEH_AG: "string",
    GERBEH_LG: "string",
    GERBEH_LKZ: "string",
    GERBEH_OLG: "string",
    GERBEH_STAMM: "string",
    GERBEH_TYP_INFO: "Zivilgericht - Amtsgericht",
    ORT: "string",
    ORTK: "string",
    PLZ: "string",
    PLZM_INFO: "Zustellbezirk",
  };

  it("handles valid PlzOrtk data", () => {
    const input = { JMTD14_VT_ERWERBER_PLZORTK: [plzOrtkEntry] };
    expect(
      conversions["JMTD14_VT_ERWERBER_PLZORTK_DATA_TABLE.json"](input)
    ).toEqual({ [plzOrtkEntry.PLZ]: [plzOrtkEntry] });
  });

  it("ignores entries without prozesskosten", () => {
    let plzOrtkEntry2 = { ...plzOrtkEntry };
    plzOrtkEntry2.ANGELEGENHEIT_INFO = "arbitrary value";
    const input = { JMTD14_VT_ERWERBER_PLZORTK: [plzOrtkEntry, plzOrtkEntry2] };

    expect(
      conversions["JMTD14_VT_ERWERBER_PLZORTK_DATA_TABLE.json"](input)
    ).toEqual({ [plzOrtkEntry.PLZ]: [plzOrtkEntry] });
  });
});

describe("PlzStrn data conversions", () => {
  const plzStrnEntry: Jmtd14VTErwerberPlzstrn = {
    AG: "string",
    ANGELEGENHEIT_INFO: "Prozesskostenhilfe eingehend",
    HNR_BIS: "string",
    HNR_MERKMAL_INFO: "fortlaufende Hausnummern",
    HNR_VON: "string",
    LG: "string",
    LKZ: "string",
    OLG: "string",
    ORTK: "string",
    PLZ: "string",
    STRN: "string",
    TYP_INFO: "Zivilgericht - Amtsgericht",
  };

  it("handles valid PlzStrn data", () => {
    const input = { JMTD14_VT_ERWERBER_PLZSTRN: [plzStrnEntry] };
    expect(
      conversions["JMTD14_VT_ERWERBER_PLZSTRN_DATA_TABLE.json"](input)
    ).toEqual({ [plzStrnEntry.PLZ]: [plzStrnEntry] });
  });

  it("filters invalid PlzStrn data", () => {
    let plzStrnEntry2 = { ...plzStrnEntry };
    plzStrnEntry2.TYP_INFO = "Arbeitsgericht";

    const input = { JMTD14_VT_ERWERBER_PLZSTRN: [plzStrnEntry] };
    expect(
      conversions["JMTD14_VT_ERWERBER_PLZSTRN_DATA_TABLE.json"](input)
    ).toEqual({ [plzStrnEntry.PLZ]: [plzStrnEntry] });
  });
});
