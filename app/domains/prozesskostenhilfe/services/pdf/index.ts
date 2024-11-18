import { PDFDocument } from "pdf-lib";
import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { appendPagesToPdf } from "~/services/pdf/appendPagesToPdf";
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
import { fillPerson } from "./A_person";
import { createAttachmentPages } from "./attachment/createAttachmentPages";
import { fillRechtsschutzversicherung } from "./B_rechtsschutzversicherung";
import { fillUnterhaltsanspruch } from "./C_unterhaltspflichtige_person";
import { fillUnterhaltAngehoerige } from "./D_angehoerige";
import { fillOwnBruttoEinnahmen } from "./E_bruttoEinnahmen/bruttoEinnahmen_eigenes";
import { fillBruttoEinnahmenPartner } from "./E_bruttoEinnahmen/bruttoEinnahmen_partner";
import { fillAbzuege } from "./F_abzuege";
import { fillEigentum } from "./G_eigentum";
import { fillGrundvoraussetzungen } from "./grundvoraussetzungen";
import { fillWohnkosten } from "./H_wohnkosten";
import { fillZahlungsverpflichtungen } from "./I_zahlungsverpflichtungen";
import { fillBelastungen } from "./J_belastungen";
export { getProzesskostenhilfeParameters };

export type PkhPdfFillFunction = PdfFillFunction<
  ProzesskostenhilfeFormularContext,
  ProzesskostenhilfePDF
>;

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

  const filledFormPdfDocument = await fillPdf({
    flowId: "/prozesskostenhilfe/formular",
    pdfValues,
    yPositionsDruckvermerk: [43, 51, 40, 44],
    xPositionsDruckvermerk: 9,
  });

  if (attachment && attachment.length > 0) {
    const pdfKitBuffer = await pdfFromUserData(
      userData,
      buildProzesskostenhilfePDFDocument,
      attachment,
    );

    const mainPdfDocument = await PDFDocument.load(pdfKitBuffer);

    return appendPagesToPdf(filledFormPdfDocument, mainPdfDocument);
  }

  return filledFormPdfDocument.save();
}
