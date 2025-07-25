import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createStamp, STAMP_TEXT, STAMP_TEXT_WIDTH } from "../createStamp";

describe("createStamp", () => {
  it("should create document with stamp", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createStamp(mockDoc, mockStruct, true);

    const structMock = mockDoc.struct;

    expect(structMock).toHaveBeenCalledWith("P", {}, expect.any(Function));
    expect(mockDoc.text).toHaveBeenCalledWith(
      STAMP_TEXT,
      expect.anything(),
      expect.anything(),
      {
        align: "center",
        baseline: "middle",
        width: STAMP_TEXT_WIDTH,
      },
    );
  });

  it("should create artifact content when isLastPage is false", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createStamp(mockDoc, mockStruct, false);

    expect(mockDoc.struct).not.toHaveBeenCalledWith(
      "P",
      {},
      expect.any(Function),
    );
    expect(mockDoc.markContent).toHaveBeenCalledWith("Artifact", {
      type: "Pagination",
    });
    expect(mockDoc.text).toHaveBeenCalledWith(
      STAMP_TEXT,
      expect.anything(),
      expect.anything(),
      {
        align: "center",
        baseline: "middle",
        width: STAMP_TEXT_WIDTH,
      },
    );
  });

  it("should rotate, draw rect and stroke, then unrotate", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createStamp(mockDoc, mockStruct, false);

    expect(mockDoc.rotate).toHaveBeenCalledWith(-90, {
      origin: [55, 770],
    });
    expect(mockDoc.rect).toHaveBeenCalledWith(40, 750, STAMP_TEXT_WIDTH, 20);
    expect(mockDoc.stroke).toHaveBeenCalled();
    expect(mockDoc.rotate).toHaveBeenCalledWith(90, {
      origin: [55, 770],
    });
  });
});
