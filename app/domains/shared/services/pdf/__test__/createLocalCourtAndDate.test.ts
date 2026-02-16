import { type Mock } from "vitest";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import type { Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";
import {
  createLocalCourtAndDate,
  CREATION_PDF_TEXT,
  TO_THE_COURT_TEXT,
} from "../createLocalCourtAndDate";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

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

describe("createLocalCourtAndDate", () => {
  it("should create the document with the local court and date", () => {
    const mockDate = new Date("2024-10-14");
    vi.setSystemTime(mockDate);

    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    mockDoc.y = 200;
    mockDoc.fillOpacity = vi.fn().mockReturnThis();

    createLocalCourtAndDate(mockDoc, mockStruct, amtsgericht);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));
    expect(mockDoc.text).toHaveBeenCalledWith(
      CREATION_PDF_TEXT + " 14.10.2024",
      70,
      200,
      {
        align: "right",
      },
    );
    expect(mockDoc.text).toHaveBeenCalledWith(TO_THE_COURT_TEXT, 70, 200, {
      align: "left",
      continued: false,
    });

    expect(mockDoc.text).toHaveBeenCalledWith(amtsgericht.BEZEICHNUNG, {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith(",", { continued: false });
    expect(mockDoc.text).toHaveBeenCalledWith(
      `${amtsgericht.PLZ_ZUSTELLBEZIRK} ${amtsgericht.ORT}`,
    );
  });

  it("should handle missing local court gracefully", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    mockDoc.y = 200;
    mockDoc.fillOpacity = vi.fn().mockReturnThis();

    createLocalCourtAndDate(mockDoc, mockStruct, undefined);

    expect(mockDoc.text).toHaveBeenCalledWith(TO_THE_COURT_TEXT, 70, 200, {
      align: "left",
      continued: false,
    });
    expect(mockDoc.text).not.toHaveBeenCalledWith(null, { align: "left" });
  });
});

describe("createLocalCourtAndDate - accessibility", () => {
  it("should call the createLocalCourtAndDate with two paragraphs", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    mockDoc.y = 200;
    mockDoc.fillOpacity = vi.fn().mockReturnThis();

    createLocalCourtAndDate(mockDoc, mockStruct, undefined);
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));
    const callsWithP = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "P",
    );
    expect(callsWithP).toHaveLength(2);
  });
});
