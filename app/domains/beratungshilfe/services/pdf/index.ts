import { PDFDocument } from "pdf-lib";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import { getBeratungshilfeParameters } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { type FlowId } from "~/domains/flowIds";
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
import { downloadUserFile } from "~/services/upload/fileUploadHelpers.server";
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
  cookieHeader: string | null,
  flowId: FlowId,
) {
  /**
   * Extracts all saved file keys from userData.
   * @param userData user data which can contain saved file keys in the form of arrays of objects
   * @returns an array of all saved file keys
   */
  const extractSavedFileKeys = (userData: BeratungshilfeFormularContext) => {
    const allKeys: string[] = [];
    for (const value of Object.values(userData)) {
      if (Array.isArray(value)) {
        for (const file of value) {
          if (file.savedFileKey) {
            allKeys.push(file.savedFileKey);
          }
        }
      }
    }
    return allKeys;
  };
  /**
   * Embeds user uploaded files into a PDF document.
   * @param mainPdfBuffer The PDF document as a Uint8Array
   * @param userData The user data containing saved file keys
   * @param cookieHeader The cookie header for the request for authentication
   * @param flowId The flow ID for the request
   * @returns The resulting PDF document as a Uint8Array
   */
  async function embedUserFilesToPdf(
    mainPdfBuffer: Uint8Array,
    userData: BeratungshilfeFormularContext,
    cookieHeader: string | null,
    flowId: FlowId,
  ) : Promise<Uint8Array> {
  const mainPdfDocument = await PDFDocument.load(mainPdfBuffer);
  const savedFileKeys = extractSavedFileKeys(userData);
  
  for (const savedFileKey of savedFileKeys) {
    const userFileBuffer = await downloadUserFile(
      cookieHeader,
      flowId,
      savedFileKey,
    );

    const pages = await mainPdfDocument.embedPdf(userFileBuffer);

    for (const page of pages) {
      const newPage = mainPdfDocument.addPage();
      newPage.drawPage(page);
    }
  }
  const finalPdf = mainPdfDocument.save();
  return finalPdf;
}

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
    yPositionsDruckvermerk: [90, 108, 138], // Different y positions because the form boxes jump for each page
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

  if(userData.abgabeArt === "online") {
      const embeddedPdfBuffer = await embedUserFilesToPdf(pdfKitBuffer, userData, cookieHeader, flowId);
      const embeddedPdfDocument = await PDFDocument.load(embeddedPdfBuffer);
      return appendPagesToPdf(filledPdfFormDocumentWithMetadata, embeddedPdfDocument);    
    } else {
      return appendPagesToPdf(filledPdfFormDocumentWithMetadata, mainPdfDocument); 
    }
}


