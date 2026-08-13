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
      "Datenblatt zur Vorbereitung eines Erbscheinsantrags",
      {
        align: "left",
      },
    );
  });
});
