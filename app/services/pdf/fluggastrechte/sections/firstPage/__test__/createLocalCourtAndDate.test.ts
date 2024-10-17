import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import {
  createLocalCourtAndDate,
  CREATION_PDF_TEXT,
  TO_THE_COURT_TEXT,
} from "../createLocalCourtAndDate";

describe("createLocalCourtAndDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should create the document with the local court and date", () => {
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

    expect(mockDoc.text).toHaveBeenCalledWith(
      userDataMock.zustaendigesAmtsgericht.bezeichnung,
      { align: "left" },
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      userDataMock.zustaendigesAmtsgericht.strasseMitHausnummer,
      { align: "left" },
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      userDataMock.zustaendigesAmtsgericht.plzUndStadt,
      { align: "left" },
    );
  });

  it("should handle missing local court gracefully", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWithoutCourt = {
      ...userDataMock,
      zustaendigesAmtsgericht: undefined,
    };

    createLocalCourtAndDate(mockDoc, mockStruct, userDataWithoutCourt);

    expect(mockDoc.text).toHaveBeenCalledWith(TO_THE_COURT_TEXT, {
      align: "left",
    });
    expect(mockDoc.text).toHaveBeenCalledWith("", {
      align: "left",
    });

    expect(mockDoc.text).not.toHaveBeenCalledWith(null, { align: "left" });
  });
});
