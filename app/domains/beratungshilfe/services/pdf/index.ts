import { PDFDocument } from "pdf-lib";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import { getBeratungshilfeParameters } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import {
  addMetadataToPdf,
  type Metadata,
} from "~/services/pdf/addMetadataToPdf";
import { appendPagesToPdf } from "~/services/pdf/appendPagesToPdf";
import { createAttachmentPages } from "~/services/pdf/attachment/createAttachmentPages";
import {
  pdfFillReducer,
  type PdfFillFunction,
} from "~/services/pdf/fillOutFunction";
import { fillPdf } from "~/services/pdf/fillPdf.server";
import { createFooter } from "~/services/pdf/footer/createFooter";
import type { PDFDocumentBuilder } from "~/services/pdf/pdfFromUserData";
import { pdfFromUserData } from "~/services/pdf/pdfFromUserData";
import { createChecklistPage } from "./checklist/createChecklistPage";
import { fillAngelegenheit } from "./pdfForm/A_angelegenheit";
import { fillVorraussetzungen } from "./pdfForm/B_vorraussetzungen";
import { fillEinkommen } from "./pdfForm/C_einkommen";
import { fillWohnen } from "./pdfForm/D_wohnen";
import { fillUnterhalt } from "./pdfForm/E_unterhalt";
import { fillBesitz } from "./pdfForm/F_besitz/F_besitz";
import { fillFooter } from "./pdfForm/footer";
import { fillAusgaben } from "./pdfForm/G_ausgaben";
import { fillHeader } from "./pdfForm/header";
export { getBeratungshilfeParameters };

export type BerHPdfFillFunction = PdfFillFunction<
  BeratungshilfeFormularContext,
  BeratungshilfePDF
>;

const METADATA: Metadata = {
  AUTHOR: "Bundesministerium der Justiz",
  CREATOR: "service.justiz.de",
  KEYWORDS: ["Beratungshilfe"],
  LANGUAGE: "de-DE",
  PRODUCER: "pdf-lib (https://github.com/Hopding/pdf-lib)",
  SUBJECT: "Antrag auf Bewilligung von Beratungshilfe",
  TITLE: "Antrag auf Bewilligung von Beratungshilfe",
};

const buildBeratungshilfePDFDocument: PDFDocumentBuilder<
  BeratungshilfeFormularContext
> = (doc, documentStruct, userData, attachment) => {
  if (attachment && attachment.length > 0) {
    // Attachment holds content of form fields which is too long - output as needed
    createAttachmentPages({
      doc,
      documentStruct,
      userData,
      attachment,
      headerText: "Anhang: Antrag auf Bewilligung von Beratungshilfe",
    });
    doc.addPage();
  }

  // Checklist will always be output
  createChecklistPage(doc, documentStruct, userData);
  createFooter(doc, documentStruct, "Anhang");
};

export async function beratungshilfePdfFromUserdata(
  userData: BeratungshilfeFormularContext,
) {
  const { pdfValues, attachment } = pdfFillReducer({
    userData,
    pdfParams: getBeratungshilfeParameters(),
    fillFunctions: [
      fillHeader,
      fillAngelegenheit,
      fillVorraussetzungen,
      fillEinkommen,
      fillUnterhalt,
      fillBesitz,
      fillAusgaben,
      fillWohnen,
      fillFooter,
    ],
  });

  const filledPdfFormDocument = await fillPdf({
    flowId: "/beratungshilfe/antrag",
    pdfValues,
    yPositionsDruckvermerk: [90, 108, 138],
    xPositionsDruckvermerk: 28,
  });

  const filledPdfFormDocumentWithMetadata = addMetadataToPdf(
    filledPdfFormDocument,
    METADATA,
  );

  const pdfKitBuffer = await pdfFromUserData(
    userData,
    buildBeratungshilfePDFDocument,
    attachment,
  );
  const mainPdfDocument = await PDFDocument.load(pdfKitBuffer);

  return appendPagesToPdf(filledPdfFormDocumentWithMetadata, mainPdfDocument);
}
