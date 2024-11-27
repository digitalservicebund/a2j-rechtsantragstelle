import { PDFDocument } from "pdf-lib";
import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { fillZahlungsverpflichtungen } from "~/domains/prozesskostenhilfe/services/pdf/pdfForm/I_zahlungsverpflichtungen";
import type { Metadata } from "~/services/pdf/addMetadataToPdf";
import { addMetadataToPdf } from "~/services/pdf/addMetadataToPdf";
import { appendPagesToPdf } from "~/services/pdf/appendPagesToPdf";
import { createAttachmentPages } from "~/services/pdf/attachment/createAttachmentPages";
import {
  type PdfFillFunction,
  pdfFillReducer,
} from "~/services/pdf/fillOutFunction";
import { fillPdf } from "~/services/pdf/fillPdf.server";
import { createFooter } from "~/services/pdf/footer/createFooter";
import {
  pdfFromUserData,
  type PDFDocumentBuilder,
} from "~/services/pdf/pdfFromUserData";
import type { Translations } from "~/services/translations/getTranslationByKey";
import { fillPerson } from "./pdfForm/A_person";
import { fillRechtsschutzversicherung } from "./pdfForm/B_rechtsschutzversicherung";
import { fillUnterhaltsanspruch } from "./pdfForm/C_unterhaltspflichtige_person";
import { fillUnterhaltAngehoerige } from "./pdfForm/D_angehoerige";
import { fillOwnBruttoEinnahmen } from "./pdfForm/E_bruttoEinnahmen/bruttoEinnahmen_eigenes";
import { fillBruttoEinnahmenPartner } from "./pdfForm/E_bruttoEinnahmen/bruttoEinnahmen_partner";
import { fillAbzuege } from "./pdfForm/F_abzuege";
import { fillEigentum } from "./pdfForm/G_eigentum";
import { fillGrundvoraussetzungen } from "./pdfForm/grundvoraussetzungen";
import { fillWohnkosten } from "./pdfForm/H_wohnkosten";
import { fillBelastungen } from "./pdfForm/J_belastungen";
export { getProzesskostenhilfeParameters };

export type PkhPdfFillFunction = PdfFillFunction<
  ProzesskostenhilfeFormularContext,
  ProzesskostenhilfePDF
>;

const METADATA: Metadata = {
  AUTHOR: "Bundesministerium der Justiz",
  CREATOR: "service.justiz.de",
  KEYWORDS: ["Prozesskostenhilfe"],
  LANGUAGE: "de-DE",
  PRODUCER: "pdf-lib (https://github.com/Hopding/pdf-lib)",
  SUBJECT:
    "Erklärung über die persönlichen und wirtschaftlichen Verhältnisse bei Prozess- oder Verfahrenskostenhilfe",
  TITLE: "Antrag auf Bewilligung von Prozesskostenhilfe",
};

const buildProzesskostenhilfePDFDocument: PDFDocumentBuilder<
  ProzesskostenhilfeFormularContext
> = (doc, documentStruct, userData, attachment) => {
  // Attachment holds content of form fields which is too long - output as needed
  createAttachmentPages({
    doc,
    documentStruct,
    userData,
    attachment,
    headerText: "Anhang: Antrag auf Bewilligung von Prozesskostenhilfe",
  });
  createFooter(doc, documentStruct, "Anhang");
};

export async function prozesskostenhilfePdfFromUserdata(
  userData: ProzesskostenhilfeFormularContext,
  flowTranslations?: Translations,
) {
  const { pdfValues, attachment } = pdfFillReducer({
    userData,
    pdfParams: getProzesskostenhilfeParameters(),
    fillFunctions: [
      fillPerson,
      fillRechtsschutzversicherung,
      fillGrundvoraussetzungen,
      fillUnterhaltsanspruch,
      fillUnterhaltAngehoerige,
      fillOwnBruttoEinnahmen,
      fillBruttoEinnahmenPartner,
      fillAbzuege,
      fillEigentum,
      fillBelastungen,
      fillWohnkosten,
      fillZahlungsverpflichtungen,
    ],
  });

  // Adding this so flowTranslations isn't automatically removed for being unused; to be added in a subsequent PR for PKH PDF
  // eslint-disable-next-line no-console
  console.log(flowTranslations);

  const filledPdfFormDocument = await fillPdf({
    flowId: "/prozesskostenhilfe/formular",
    pdfValues,
    yPositionsDruckvermerk: [43, 51, 40, 44],
    xPositionsDruckvermerk: 9,
  });

  const filledPdfFormDocumentWithMetadata = addMetadataToPdf(
    filledPdfFormDocument,
    METADATA,
  );

  if (attachment && attachment.length > 0) {
    const pdfKitBuffer = await pdfFromUserData(
      userData,
      buildProzesskostenhilfePDFDocument,
      attachment,
    );

    const mainPdfDocument = await PDFDocument.load(pdfKitBuffer);

    return appendPagesToPdf(filledPdfFormDocumentWithMetadata, mainPdfDocument);
  }

  return filledPdfFormDocumentWithMetadata.save();
}
