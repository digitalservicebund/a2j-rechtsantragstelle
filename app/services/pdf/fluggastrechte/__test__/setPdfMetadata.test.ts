import PDFDocument from "pdfkit";
import {
  AUTHOR,
  CREATOR,
  KEYWORDS,
  setPdfMetadata,
  SUBJECT,
  TITLE,
  VERSION,
} from "../setPdfMetadata";

describe("setPdfMetadata", () => {
  it("should create the PDF with the correct metadata", () => {
    const document = new PDFDocument();

    setPdfMetadata(document);

    expect(document.version).toBe(VERSION);
    expect(document.info.Title).toBe(TITLE);
    expect(document.info.Author).toBe(AUTHOR);
    expect(document.info.Subject).toBe(SUBJECT);
    expect(document.info.Keywords).toBe(KEYWORDS);
    expect(document.info.CreationDate).not.toBeNull();
    expect(document.info.Creator).toBe(CREATOR);
  });
});
