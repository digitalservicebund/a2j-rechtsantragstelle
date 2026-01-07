import PDFDocument from "pdfkit";
import {
  AUTHOR,
  CREATOR,
  setPdfMetadata,
  VERSION,
} from "../../../../shared/services/pdf/setPdfMetadata";
import { KEYWORDS } from "../fluggastrechtePdfFromUserdata";
import { SUBJECT } from "../fluggastrechtePdfFromUserdata";
import { TITLE } from "../fluggastrechtePdfFromUserdata";

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
