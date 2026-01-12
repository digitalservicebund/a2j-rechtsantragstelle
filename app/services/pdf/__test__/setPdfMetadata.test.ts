import PDFDocument from "pdfkit";
import {
  KEYWORDS,
  SUBJECT,
  TITLE,
} from "../../../domains/fluggastrechte/services/pdf/fluggastrechtePdfFromUserdata";
import {
  AUTHOR,
  CREATOR,
  setPdfMetadata,
  VERSION,
} from "~/services/pdf/setPdfMetadata";

describe("setPdfMetadata", () => {
  it("should create the PDF with the correct metadata", () => {
    const document = new PDFDocument();

    setPdfMetadata(document, {
      keywords: KEYWORDS,
      title: TITLE,
      subject: SUBJECT,
    });

    expect(document.version).toBe(VERSION);
    expect(document.info.Title).toBe(TITLE);
    expect(document.info.Author).toBe(AUTHOR);
    expect(document.info.Subject).toBe(SUBJECT);
    expect(document.info.Keywords).toBe(KEYWORDS);
    expect(document.info.CreationDate).not.toBeUndefined();
    expect(document.info.Creator).toBe(CREATOR);
  });
});
