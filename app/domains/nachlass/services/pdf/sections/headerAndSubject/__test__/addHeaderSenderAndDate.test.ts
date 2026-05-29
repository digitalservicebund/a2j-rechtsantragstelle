import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import { addHeaderSenderAndDate } from "../addHeaderSenderAndDate";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const userData = {
  ausschlagendePersonVorname: "Max",
  ausschlagendePersonNachname: "Mustermann",
  ausschlagendePersonStrasse: "Musterstraße",
  ausschlagendePersonHausnummer: "1",
  ausschlagendePersonPlz: "12345",
  ausschlagendePersonOrt: "Musterstadt",
} satisfies NachlassErbausschlagungAnfrageUserData;

describe("addHeaderSenderAndDate", () => {
  it("should add the date to the document structure", () => {
    const mockDate = new Date("2024-10-14");
    vi.setSystemTime(mockDate);

    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    mockDoc.y = 200;
    mockDoc.fillOpacity = vi.fn().mockReturnThis();

    addHeaderSenderAndDate(mockDoc, mockStruct, userData);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Erstellt am: 14.10.2024",
      70,
      200,
      {
        align: "right",
      },
    );
  });

  it("should add sender info to the document structure", () => {
    const mockDate = new Date("2024-10-14");
    vi.setSystemTime(mockDate);

    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    mockDoc.y = 200;
    mockDoc.fillOpacity = vi.fn().mockReturnThis();

    addHeaderSenderAndDate(mockDoc, mockStruct, userData);

    expect(mockDoc.text).toHaveBeenCalledWith("Absender", 70, 200, {
      align: "left",
      continued: false,
    });

    expect(mockDoc.text).toHaveBeenCalledWith("Max Mustermann", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith(",", { continued: false });
    expect(mockDoc.text).toHaveBeenCalledWith("12345 Musterstadt");
  });
});
