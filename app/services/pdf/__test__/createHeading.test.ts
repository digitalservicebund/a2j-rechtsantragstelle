import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createHeading } from "../createHeading";
import { pdfStyles } from "../pdfStyles";

describe("createHeading", () => {
  it("should create heading with the correct string and styling for level H1", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const level = "H1";
    const headingString = "The Heading";

    createHeading(mockDoc, mockStruct, headingString, level);

    expect(mockDoc.struct).toHaveBeenCalledWith(
      level,
      {},
      expect.any(Function),
    );
    expect(mockDoc.fontSize).toHaveBeenCalledWith(pdfStyles.h1.fontSize);
    expect(mockDoc.font).toHaveBeenCalledWith(pdfStyles.h1.font);
    expect(mockDoc.text).toHaveBeenCalledWith(headingString);
  });

  it("should create heading with the correct string and styling for level H5", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const level = "H5";
    const headingString = "The Heading";

    createHeading(mockDoc, mockStruct, headingString, level);

    expect(mockDoc.struct).toHaveBeenCalledWith(
      level,
      {},
      expect.any(Function),
    );
    expect(mockDoc.fontSize).toHaveBeenCalledWith(pdfStyles.h5.fontSize);
    expect(mockDoc.font).toHaveBeenCalledWith(pdfStyles.h5.font);
    expect(mockDoc.text).toHaveBeenCalledWith(headingString);
  });
});
