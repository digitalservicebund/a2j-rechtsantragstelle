import type { PDFDocument } from "pdf-lib";
import { customPdfFormFont } from "~/services/pdf/fillPdf.server";
import type { ProzesskostenhilfeFormularContext } from "../../formular";

export function printNameInSignatureFormField(
  pdfDoc: PDFDocument,
  userData: ProzesskostenhilfeFormularContext,
) {
  if (userData.versandArt === "digital") {
    const page = pdfDoc.getPage(3);

    page.drawText(`${userData.vorname} ${userData.nachname}`, {
      x: 200,
      y: 75,
      size: 10,
      font: customPdfFormFont,
    });
  }
}
