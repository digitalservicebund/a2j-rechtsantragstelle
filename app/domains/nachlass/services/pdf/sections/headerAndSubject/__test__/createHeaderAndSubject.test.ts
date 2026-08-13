import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addHeaderSenderAndDate } from "../addHeaderSenderAndDate";
import { createHeaderAndSubject } from "../createHeaderAndSubject";

vi.mock("../addHeaderSenderAndDate");

vi.mocked(addHeaderSenderAndDate).mockImplementation(() => vi.fn());

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createHeaderAndSubject", () => {
  it("should call addHeaderSenderAndDate", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createHeaderAndSubject(mockDoc, mockStruct, {});

    expect(addHeaderSenderAndDate).toHaveBeenCalledTimes(1);
  });

  it("should create title and subject text", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createHeaderAndSubject(mockDoc, mockStruct, {});

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Datenblatt zur Vorbereitung einer Erbausschlagung",
      {
        align: "left",
      },
    );

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Sehr geehrte Damen und Herren, \nmit diesem Dokument übermittle ich Ihnen meine Daten zur Vorbereitung der Erbausschlagung.\nMir ist bewusst:",
      {
        align: "left",
      },
    );
  });

  it("should create the subject bullets", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createHeaderAndSubject(mockDoc, mockStruct, {});

    expect(mockDoc.text).toHaveBeenCalledWith(
      "• Dieses Dokument ist keine rechtswirksame Erbausschlagung.",
      expect.any(Number),
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "• Die Frist (normalerweise 6 Wochen) wird hierdurch nicht unterbrochen.",
      expect.any(Number),
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "• Ich muss für die Ausschlagung persönlich beim Gericht erscheinen.",
      expect.any(Number),
    );
  });

  it("should create the appointment text and best regards text", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createHeaderAndSubject(mockDoc, mockStruct, {
      ausschlagendePersonVorname: "Max",
      ausschlagendePersonNachname: "Mustermann",
    });

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Ich werde mich zur Terminabsprache mit Ihnen in Verbindung setzen, falls noch nicht geschehen.",
      expect.any(Number),
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Mit freundlichen Grüßen");
    expect(mockDoc.text).toHaveBeenCalledWith("Max Mustermann");
  });
});
