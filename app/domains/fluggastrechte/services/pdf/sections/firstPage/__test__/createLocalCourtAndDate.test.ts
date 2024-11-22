import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { getCourtByStartAndEndAirport } from "~/domains/fluggastrechte/services/getCourtByStartAndEndAirport";
import type { Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";
import {
  createLocalCourtAndDate,
  CREATION_PDF_TEXT,
  TO_THE_COURT_TEXT,
} from "../createLocalCourtAndDate";

vi.mock("~/domains/fluggastrechte/services/getCourtByStartAndEndAirport");

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("createLocalCourtAndDate", () => {
  it("should create the document with the local court and date", () => {
    const amtsgericht: Jmtd14VTErwerberGerbeh = {
      AG: "",
      BEZEICHNUNG: "Amtsgericht",
      LG: "",
      LKZ: "",
      OLG: "",
      ORT: "Wusterhausen",
      ORTK: "",
      PLZ_ZUSTELLBEZIRK: "15711",
      STR_HNR: "Schlossplatz 4",
      TYP_INFO: "Zivilgericht - Amtsgericht",
      XML_SUPPORT: "JA",
    } as const;

    vi.mocked(getCourtByStartAndEndAirport).mockReturnValue(amtsgericht);
    const mockDate = new Date("2024-10-14");
    vi.setSystemTime(mockDate);

    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createLocalCourtAndDate(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));

    expect(mockDoc.text).toHaveBeenCalledWith(
      CREATION_PDF_TEXT + " " + "14.10.2024",
      {
        align: "right",
      },
    );
    expect(mockDoc.text).toHaveBeenCalledWith(TO_THE_COURT_TEXT, {
      align: "left",
    });

    expect(mockDoc.text).toHaveBeenCalledWith(amtsgericht.BEZEICHNUNG, {
      align: "left",
    });
    expect(mockDoc.text).toHaveBeenCalledWith(amtsgericht.STR_HNR, {
      align: "left",
    });
    expect(mockDoc.text).toHaveBeenCalledWith(
      `${amtsgericht.PLZ_ZUSTELLBEZIRK} ${amtsgericht.ORT}`,
      { align: "left" },
    );
  });

  it("should handle missing local court gracefully", () => {
    vi.mocked(getCourtByStartAndEndAirport).mockReturnValue(undefined);
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createLocalCourtAndDate(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(TO_THE_COURT_TEXT, {
      align: "left",
    });
    expect(mockDoc.text).toHaveBeenCalledWith("", {
      align: "left",
    });

    expect(mockDoc.text).not.toHaveBeenCalledWith(null, { align: "left" });
  });
});
