import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import {
  edgeCasesForPlz,
  findCourt,
} from "~/services/gerichtsfinder/amtsgerichtData.server";
import { getPilotCourts } from "../getPilotCourts";
import {
  type Jmtd14VTErwerberGerbeh,
  type Jmtd14VTErwerberPlzstrn,
} from "~/services/gerichtsfinder/types";

vi.mock("~/services/gerichtsfinder/amtsgerichtData.server", () => ({
  edgeCasesForPlz: vi.fn(),
  findCourt: vi.fn(),
}));

const ZIP_CODE_WITH_PILOT_COURT = "10115";
const ZIP_CODE_SECONDARY_WITH_PILOT_COURT = "10119";
const ZIP_CODE_WITHOUT_PILOT_COURT = "99999";
const ZIP_CODE_WITH_EDGE_CASE = "12345";

const baseCourtData = {
  BEZEICHNUNG: "",
  ORT: "",
  ORTK: "",
  PLZ_ZUSTELLBEZIRK: "",
  STR_HNR: "",
  XML_SUPPORT: "JA" as const,
};

const PILOT_COURT: Jmtd14VTErwerberGerbeh = {
  LKZ: "11",
  OLG: "1",
  LG: "01",
  AG: "07",
  TYP_INFO: "Zivilgericht - Amtsgericht",
  ...baseCourtData,
};

const PILOT_COURT_SECONDARY: Jmtd14VTErwerberGerbeh = {
  LKZ: "08",
  OLG: "1",
  LG: "06",
  AG: "01",
  TYP_INFO: "Zivilgericht - Amtsgericht",
  ...baseCourtData,
};

const NON_PILOT_COURT: Jmtd14VTErwerberGerbeh = {
  LKZ: "12",
  OLG: "2",
  LG: "02",
  AG: "08",
  TYP_INFO: "Zivilgericht - Amtsgericht",
  ...baseCourtData,
};

const EDGE_CASE_COURT: Jmtd14VTErwerberGerbeh = {
  LKZ: "12",
  OLG: "2",
  LG: "02",
  AG: "08",
  TYP_INFO: "Zivilgericht - Amtsgericht",
  ...baseCourtData,
};

vi.mocked(findCourt).mockImplementation(({ zipCode }) => {
  if (zipCode === ZIP_CODE_WITH_PILOT_COURT) {
    return PILOT_COURT;
  }

  if (zipCode === ZIP_CODE_SECONDARY_WITH_PILOT_COURT) {
    return PILOT_COURT_SECONDARY;
  }

  if (zipCode === ZIP_CODE_WITHOUT_PILOT_COURT) {
    return NON_PILOT_COURT;
  }

  if (zipCode === ZIP_CODE_WITH_EDGE_CASE) {
    return EDGE_CASE_COURT;
  }

  return undefined;
});

vi.mocked(edgeCasesForPlz).mockImplementation((zipCode: string | undefined) => {
  if (zipCode === ZIP_CODE_WITH_EDGE_CASE) {
    return [EDGE_CASE_COURT] as unknown as Jmtd14VTErwerberPlzstrn[];
  }

  return [] as Jmtd14VTErwerberPlzstrn[];
});

describe("getPilotCourts", () => {
  it("should return empty array in case no zip code is provided", () => {
    const userData: GeldEinklagenFormularUserData = {};

    const actual = getPilotCourts(userData);

    expect(actual).toEqual([]);
  });

  it("should return empty array in case no zip code of beklagte is edge case without street and street number", () => {
    const userData: GeldEinklagenFormularUserData = {
      postleitzahlBeklagtePerson: ZIP_CODE_WITH_EDGE_CASE,
    };

    const actual = getPilotCourts(userData);

    expect(actual).toEqual([]);
  });

  it("should return empty array in case no zip code of secondary is edge case without street and street number", () => {
    const userData: GeldEinklagenFormularUserData = {
      postleitzahlSecondary: ZIP_CODE_WITH_EDGE_CASE,
    };

    const actual = getPilotCourts(userData);

    expect(actual).toEqual([]);
  });

  it("should return empty array in case no zip code of beklagte does not exist", () => {
    const userData: GeldEinklagenFormularUserData = {
      postleitzahlBeklagtePerson: "XXXX",
    };

    const actual = getPilotCourts(userData);

    expect(actual).toEqual([]);
  });

  it("should return court data in case the zip code of beklagte is pilot court", () => {
    const userData: GeldEinklagenFormularUserData = {
      postleitzahlBeklagtePerson: ZIP_CODE_WITH_PILOT_COURT,
    };

    const actual = getPilotCourts(userData);

    expect(actual.length).toEqual(1);
    expect(actual[0]).toStrictEqual(PILOT_COURT);
  });

  it("should return court data in case the zip code of secondary is pilot court", () => {
    const userData: GeldEinklagenFormularUserData = {
      postleitzahlSecondary: ZIP_CODE_WITH_PILOT_COURT,
    };

    const actual = getPilotCourts(userData);

    expect(actual.length).toEqual(1);
    expect(actual[0]).toStrictEqual(PILOT_COURT);
  });

  it("should return two courts data in case the zip code of beklagte and secondary are pilot court", () => {
    const userData: GeldEinklagenFormularUserData = {
      postleitzahlBeklagtePerson: ZIP_CODE_WITH_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_SECONDARY_WITH_PILOT_COURT,
    };

    const actual = getPilotCourts(userData);

    expect(actual.length).toEqual(2);
    expect(actual[0]).toStrictEqual(PILOT_COURT);
    expect(actual[1]).toStrictEqual(PILOT_COURT_SECONDARY);
  });

  it("should return one court data in case the zip code of beklagte and secondary are the same pilot court", () => {
    const userData: GeldEinklagenFormularUserData = {
      postleitzahlBeklagtePerson: ZIP_CODE_WITH_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_WITH_PILOT_COURT,
    };

    const actual = getPilotCourts(userData);

    expect(actual.length).toEqual(1);
    expect(actual[0]).toStrictEqual(PILOT_COURT);
  });

  it("should return one court data in case the zip code of beklagte is pilot court", () => {
    const userData: GeldEinklagenFormularUserData = {
      postleitzahlBeklagtePerson: ZIP_CODE_WITH_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_WITHOUT_PILOT_COURT,
    };

    const actual = getPilotCourts(userData);

    expect(actual.length).toEqual(1);
    expect(actual[0]).toStrictEqual(PILOT_COURT);
  });

  it("should return one court data in case the zip code of secondary is pilot court", () => {
    const userData: GeldEinklagenFormularUserData = {
      postleitzahlBeklagtePerson: ZIP_CODE_WITHOUT_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_WITH_PILOT_COURT,
    };

    const actual = getPilotCourts(userData);

    expect(actual.length).toEqual(1);
    expect(actual[0]).toStrictEqual(PILOT_COURT);
  });

  it("should return empty array in case the zip code of beklagte and secondary are not pilot court", () => {
    const userData: GeldEinklagenFormularUserData = {
      postleitzahlBeklagtePerson: ZIP_CODE_WITHOUT_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_WITHOUT_PILOT_COURT,
    };

    const actual = getPilotCourts(userData);

    expect(actual).toEqual([]);
  });
});
