import { createFooter } from "~/domains/fluggastrechte/services/pdf/sections/createFooter";
import { createFirstPage } from "~/domains/fluggastrechte/services/pdf/sections/firstPage/createFirstPage";
import { createReasonPage } from "~/domains/fluggastrechte/services/pdf/sections/reason/createReasonPage";
import { setPdfMetadata } from "~/domains/fluggastrechte/services/pdf/setPdfMetadata";
import { KontopfaendungPkontoAntragUserData } from "~/domains/kontopfaendung/pkonto/antrag/userData";
import {
  PDFDocumentBuilder,
  pdfFromUserData,
} from "~/services/pdf/pdfFromUserData";

const buildKontopfaendungPDFDocument: PDFDocumentBuilder<
  KontopfaendungPkontoAntragUserData
> = (doc, documentStruct, userData) => {
  setPdfMetadata(doc);
  createFirstPage(doc, documentStruct, userData);
  doc.addPage();
  createReasonPage(doc, documentStruct, userData);
  createFooter(doc, documentStruct, userData);
};

export function kontopfaendungPdfFromUserdata(
  userData: KontopfaendungPkontoAntragUserData,
) {
  return pdfFromUserData(userData, buildKontopfaendungPDFDocument);
}
