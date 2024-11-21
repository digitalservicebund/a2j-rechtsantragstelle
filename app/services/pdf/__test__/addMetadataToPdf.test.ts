import { PDFDocument } from "pdf-lib";
import type { Metadata } from "../addMetadataToPdf";
import { addMetadataToPdf } from "../addMetadataToPdf";

const metadata: Metadata = {
  AUTHOR: "Author Name",
  CREATOR: "Creator Name",
  KEYWORDS: ["keyword1", "keyword2"],
  LANGUAGE: "de-DE",
  PRODUCER: "Producer Name",
  SUBJECT: "Subject",
  TITLE: "Title",
};

export const mockPdfLibDocument = () => {
  return {
    setAuthor: vi.fn(),
    setCreator: vi.fn(),
    setKeywords: vi.fn(),
    setLanguage: vi.fn(),
    setProducer: vi.fn(),
    setSubject: vi.fn(),
    setTitle: vi.fn(),
    setCreationDate: vi.fn(),
    setModificationDate: vi.fn(),
  } as unknown as PDFDocument;
};

describe("addMetadataToPdf", () => {
  it("should add metadata to the PDF document", () => {
    const doc = mockPdfLibDocument();

    addMetadataToPdf(doc, metadata);

    expect(doc.setAuthor).toHaveBeenCalledWith(metadata.AUTHOR);
    expect(doc.setCreator).toHaveBeenCalledWith(metadata.CREATOR);
    expect(doc.setKeywords).toHaveBeenCalledWith(metadata.KEYWORDS);
    expect(doc.setLanguage).toHaveBeenCalledWith(metadata.LANGUAGE);
    expect(doc.setProducer).toHaveBeenCalledWith(metadata.PRODUCER);
    expect(doc.setSubject).toHaveBeenCalledWith(metadata.SUBJECT);
    expect(doc.setTitle).toHaveBeenCalledWith(metadata.TITLE);
    expect(doc.setCreationDate).toHaveBeenCalled();
    expect(doc.setModificationDate).toHaveBeenCalled();
  });

  it("should confirm metadata can be read from the document", async () => {
    const mockDoc = await PDFDocument.create();

    addMetadataToPdf(mockDoc, metadata);

    expect(mockDoc.getAuthor()).toBe(metadata.AUTHOR);
    expect(mockDoc.getCreator()).toBe(metadata.CREATOR);
    expect(mockDoc.getKeywords()).toEqual(metadata.KEYWORDS.join(" "));
    expect(mockDoc.getProducer()).toBe(metadata.PRODUCER);
    expect(mockDoc.getSubject()).toBe(metadata.SUBJECT);
    expect(mockDoc.getTitle()).toBe(metadata.TITLE);
    expect(mockDoc.getCreationDate()).toBeTruthy();
    expect(mockDoc.getModificationDate()).toBeTruthy();
  });
});
