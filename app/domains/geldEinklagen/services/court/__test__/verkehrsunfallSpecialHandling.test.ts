import { applyVerkehrsunfallSpecialHandling } from "../verkehrsunfallSpecialHandling";
import { type Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";

const berlinCourt: Jmtd14VTErwerberGerbeh = {
  LKZ: "11",
  OLG: "1",
  LG: "01",
  AG: "07",
  TYP_INFO: "Zivilgericht - Amtsgericht",
  BEZEICHNUNG: "",
  ORT: "Berlin",
  ORTK: "",
  PLZ_ZUSTELLBEZIRK: "",
  STR_HNR: "",
  XML_SUPPORT: "JA",
};

const hamburgPilotCourt: Jmtd14VTErwerberGerbeh = {
  LKZ: "08",
  OLG: "1",
  LG: "06",
  AG: "01",
  TYP_INFO: "Zivilgericht - Amtsgericht",
  BEZEICHNUNG: "",
  ORT: "Hamburg",
  ORTK: "",
  PLZ_ZUSTELLBEZIRK: "",
  STR_HNR: "",
  XML_SUPPORT: "JA",
};

const otherPilotCourt: Jmtd14VTErwerberGerbeh = {
  LKZ: "12",
  OLG: "2",
  LG: "02",
  AG: "08",
  TYP_INFO: "Zivilgericht - Amtsgericht",
  BEZEICHNUNG: "",
  ORT: "Somewhere",
  ORTK: "",
  PLZ_ZUSTELLBEZIRK: "",
  STR_HNR: "",
  XML_SUPPORT: "JA",
};

describe("applyVerkehrsunfallSpecialHandling", () => {
  it("returns empty array when single court is Berlin", () => {
    const result = applyVerkehrsunfallSpecialHandling([berlinCourt]);
    expect(result).toEqual([]);
  });

  it("returns non-Berlin court when one Berlin and one non-Berlin", () => {
    const result = applyVerkehrsunfallSpecialHandling([
      berlinCourt,
      hamburgPilotCourt,
    ]);
    expect(result).toEqual([hamburgPilotCourt]);
  });

  it("returns original pilotCourts when no special case applies", () => {
    const result = applyVerkehrsunfallSpecialHandling([otherPilotCourt]);
    expect(result).toEqual([otherPilotCourt]);

    const result2 = applyVerkehrsunfallSpecialHandling([
      otherPilotCourt,
      hamburgPilotCourt,
    ]);
    expect(result2).toEqual([otherPilotCourt, hamburgPilotCourt]);
  });
});
