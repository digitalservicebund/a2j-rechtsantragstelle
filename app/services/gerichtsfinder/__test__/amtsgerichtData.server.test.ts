import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { getEncrypted } from "~/services/gerichtsfinder/encryptedStorage.server";

vi.mock("~/services/gerichtsfinder/encryptedStorage.server");

const mockCourtData = {
  "JMTD14_VT_ERWERBER_PLZSTRN_DATA_TABLE.json": {
    "20457": [
      {
        HNR_BIS: "001",
        HNR_MERKMAL_INFO: "fortlaufende Hausnummern",
        AG: "05",
        HNR_VON: "001",
        ANGELEGENHEIT_INFO: "Prozesskostenhilfe eingehend",
        STRN: "KLÜTJENFELDER STRASSE",
        LKZ: "02",
        OLG: "1",
        LG: "01",
        TYP_INFO: "Zivilgericht - Amtsgericht",
        PLZ: "20457",
        ORTK: "HAMBURG",
      },
      {
        HNR_BIS: "010",
        HNR_MERKMAL_INFO: "gerade Hausnummern",
        AG: "05",
        HNR_VON: "002",
        ANGELEGENHEIT_INFO: "Prozesskostenhilfe eingehend",
        STRN: "KLÜTJENFELDER STRASSE",
        LKZ: "02",
        OLG: "1",
        LG: "01",
        TYP_INFO: "Zivilgericht - Amtsgericht",
        PLZ: "20457",
        ORTK: "HAMBURG",
      },
      {
        HNR_BIS: "017",
        HNR_MERKMAL_INFO: "ungerade Hausnummern",
        AG: "05",
        HNR_VON: "017",
        ANGELEGENHEIT_INFO: "Prozesskostenhilfe eingehend",
        STRN: "KLÜTJENFELDER STRASSE",
        LKZ: "02",
        OLG: "1",
        LG: "01",
        TYP_INFO: "Zivilgericht - Amtsgericht",
        PLZ: "20457",
        ORTK: "HAMBURG",
      },
      {
        HNR_BIS: "020",
        HNR_MERKMAL_INFO: "gerade Hausnummern",
        AG: "05",
        HNR_VON: "018",
        ANGELEGENHEIT_INFO: "Prozesskostenhilfe eingehend",
        STRN: "KLÜTJENFELDER STRASSE",
        LKZ: "02",
        OLG: "1",
        LG: "01",
        TYP_INFO: "Zivilgericht - Amtsgericht",
        PLZ: "20457",
        ORTK: "HAMBURG",
      },
    ],
    10789: [
      {
        HNR_BIS: "999",
        HNR_MERKMAL_INFO: "fortlaufende Hausnummern",
        AG: "01",
        HNR_VON: "019",
        ANGELEGENHEIT_INFO: "Prozesskostenhilfe eingehend",
        STRN: "AUGSBURGER STR.",
        LKZ: "11",
        OLG: "1",
        LG: "01",
        TYP_INFO: "Zivilgericht - Amtsgericht",
        PLZ: "10789",
        ORTK: "BERLIN",
        STRN_NORMALIZED: "augsburger str.",
      },
    ],
  },
  "JMTD14_VT_ERWERBER_GERBEH_DATA_TABLE.json": {
    "02_1_01_01_zivilgericht-amtsgericht": {
      PLZ_GROSSEMPFAENGER: "20348",
      XJUSTIZID: "K1101",
      URL1: "www.amtsgericht.hamburg.de",
      AG: "01",
      PLZ_ZUSTELLBEZIRK: "20355",
      ERV_ZIVIL: "J",
      OLG: "1",
      TYP_INFO: "Zivilgericht - Amtsgericht",
      PLZ_POSTFACH: "20348",
      POSTFACH: "30 01 21",
      ERV_FAMILIE: "J",
      AUT_MAHN_VERF_MERKMAL_INFO:
        "AMVM für dieses AG (Beleg, EDA). Zentrale Zuständigkeit",
      ORT: "Hamburg",
      STR_HNR: "Sievekingplatz 1",
      XML_SUPPORT: "JA",
      KAMMER_FUER_HANDELSSACH: "NEIN",
      BEZEICHNUNG: "Amtsgericht Hamburg",
      LKZ: "02",
      TEL: "040 115",
      LG: "01",
      FAX: "040 42843-4318",
      ERV_FG: "J",
      ORTK: "HAMBURG",
      ERV_STRAF: "J",
    },
    "02_1_01_05_zivilgericht-amtsgericht": {
      XJUSTIZID: "K1105",
      URL1: "www.justiz.hamburg.de/ag-harburg/",
      AG: "05",
      PLZ_ZUSTELLBEZIRK: "21073",
      ERV_ZIVIL: "J",
      OLG: "1",
      TYP_INFO: "Zivilgericht - Amtsgericht",
      PLZ_POSTFACH: "21041",
      POSTFACH: "90 01 61",
      ERV_FAMILIE: "J",
      AUT_MAHN_VERF_MERKMAL_INFO:
        "AMVM für dieses AG (Beleg, EDA). Zentrale Zuständigkeit",
      ORT: "Hamburg",
      STR_HNR: "Buxtehuder Straße 9",
      XML_SUPPORT: "JA",
      KAMMER_FUER_HANDELSSACH: "NEIN",
      BEZEICHNUNG: "Amtsgericht Hamburg-Harburg",
      LKZ: "02",
      TEL: "040 115",
      LG: "01",
      FAX: "040 427983-179",
      ERV_FG: "J",
      ORTK: "HAMBURG",
      ERV_STRAF: "J",
    },
    "11_1_01_01_zivilgericht-amtsgericht": {
      PLZ_GROSSEMPFAENGER: "14046",
      XJUSTIZID: "F1103",
      URL2: "www.berlin.de/sen/justiz/",
      URL1: "https://www.berlin.de/gerichte/amtsgericht-charlottenburg/",
      AG: "01",
      PLZ_ZUSTELLBEZIRK: "14057",
      ERV_ZIVIL: "J",
      OLG: "1",
      TYP_INFO: "Zivilgericht - Amtsgericht",
      AUT_MAHN_VERF_MERKMAL_INFO:
        "AMVM für dieses AG (Beleg, EDA). Zentrale Zuständigkeit",
      ORT: "Berlin",
      STR_HNR: "Amtsgerichtsplatz 1",
      ERV_GRUNDBUCH: "J",
      XML_SUPPORT: "JA",
      KAMMER_FUER_HANDELSSACH: "NEIN",
      BEZEICHNUNG: "Amtsgericht Charlottenburg",
      LKZ: "11",
      TEL: "030 90177-0",
      LG: "01",
      FAX: "030 90177-447",
      ERV_FG: "J",
      ORTK: "BERLIN",
      ERV_STRAF: "J",
    },
  },
  "JMTD14_VT_ERWERBER_PLZORTK_DATA_TABLE.json": {
    "20457": [
      {
        ORT: "Hamburg",
        GERBEH_LKZ: "02",
        GERBEH_LG: "01",
        PLZM_INFO: "Zustellbezirk",
        GERBEH_OLG: "1",
        GERBEH_TYP_INFO: "Zivilgericht - Amtsgericht",
        ANGELEGENHEIT_INFO: "Prozesskostenhilfe eingehend",
        GERBEH_STAMM: "00",
        GERBEH_AG: "01",
        PLZ: "20457",
        ORTK: "HAMBURG",
      },
    ],
  },
};

describe("amtsGerichtData Helpers", () => {
  beforeEach(() => {
    vi.mocked(getEncrypted).mockReturnValue(mockCourtData);
  });

  describe("findCourt", () => {
    it("should return the default court if no valid street slug is passed", () => {
      expect(
        findCourt({ zipCode: "20457", streetSlug: "default" }),
      ).toHaveProperty("BEZEICHNUNG", "Amtsgericht Hamburg");
      expect(
        findCourt({ zipCode: "20457", streetSlug: undefined }),
      ).toHaveProperty("BEZEICHNUNG", "Amtsgericht Hamburg");
    });

    it("should return undefined if no valid court is found", () => {
      expect(
        findCourt({ zipCode: "12345", streetSlug: "default" }),
      ).toBeUndefined();
    });

    it("should return the correct court if a valid street slug is passed", () => {
      expect(
        findCourt({
          zipCode: "20457",
          streetSlug: "kluetjenfelder_str.",
          houseNumber: "1",
        }),
      ).toHaveProperty("STR_HNR", "Buxtehuder Straße 9");
      expect(
        findCourt({
          zipCode: "20457",
          streetSlug: "kluetjenfelder_str.",
          houseNumber: "12",
        }),
      ).toHaveProperty("STR_HNR", "Sievekingplatz 1");
    });

    it("should also handle streets saved as `strasse` instead of `str.`", () => {
      expect(
        findCourt({
          zipCode: "10789",
          streetSlug: "augsburger_str.",
          houseNumber: "19",
        }),
      ).toHaveProperty("STR_HNR", "Amtsgerichtsplatz 1");
    });
  });
});
