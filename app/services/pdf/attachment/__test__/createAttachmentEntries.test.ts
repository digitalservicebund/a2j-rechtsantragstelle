import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import type { AttachmentEntries } from "..";
import { createAttachmentEntries } from "../createAttachmentEntries";

describe("createAttachmentEntries", () => {
  it("should create attachment entries for single object", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const attachment: AttachmentEntries = [
      { title: "Test Title", text: "Test Text", level: "h2" },
    ];

    createAttachmentEntries(mockDoc, mockStruct, attachment);

    const structMock = mockDoc.struct;

    expect(structMock).toHaveBeenCalledWith("H2", {}, expect.any(Function));
    expect(mockDoc.text).toHaveBeenCalledWith("Test Title");
    expect(structMock).toHaveBeenCalledWith("P", {}, expect.any(Function));
    expect(mockDoc.text).toHaveBeenCalledWith("Test Text");
  });

  it("should create attachment entries for multiple objects", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const attachment: AttachmentEntries = [
      { title: "Test Title 1", text: "Test Text 1", level: "h2" },
      { title: "Test Title 2", text: "Test Text 2", level: "h3" },
    ];

    createAttachmentEntries(mockDoc, mockStruct, attachment);

    const structMock = mockDoc.struct;

    expect(structMock).toHaveBeenCalledWith("H2", {}, expect.any(Function));
    expect(mockDoc.text).toHaveBeenCalledWith("Test Title 1");
    expect(structMock).toHaveBeenCalledWith("P", {}, expect.any(Function));
    expect(mockDoc.text).toHaveBeenCalledWith("Test Text 1");
    expect(structMock).toHaveBeenCalledWith("H3", {}, expect.any(Function));
    expect(mockDoc.text).toHaveBeenCalledWith("Test Title 2");
    expect(structMock).toHaveBeenCalledWith("P", {}, expect.any(Function));
    expect(mockDoc.text).toHaveBeenCalledWith("Test Text 2");
  });
});
