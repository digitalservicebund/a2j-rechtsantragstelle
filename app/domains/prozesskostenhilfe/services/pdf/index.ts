import { PDFDocument } from "pdf-lib";
import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { belegeStrings } from "~/domains/prozesskostenhilfe/formular/stringReplacements";
import { fillZahlungsverpflichtungen } from "~/domains/prozesskostenhilfe/services/pdf/pdfForm/I_zahlungsverpflichtungen";
import { buildBelegeList } from "~/domains/prozesskostenhilfe/services/pdf/util";
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
import loadHinweisblatt from "./loadHinweisblatt";
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
import { fillFooter } from "./pdfForm/K_footer";
import { printNameInSignatureFormField } from "./printNameInSignatureFormField";
import { createWeitereAngabenAnhang } from "./weitereAngabenAnhang/createWeitereAngabenAnhang";
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
> = (doc, documentStruct, userData, attachment, translations) => {
  // Attachment holds content of form fields which is too long - output as needed
  createAttachmentPages({
    doc,
    documentStruct,
    userData,
    attachment,
    headerText: "Anhang: Antrag auf Bewilligung von Prozesskostenhilfe",
  });
  if (requiresBelege(userData)) {
    buildBelegeList({ doc, documentStruct, userData, translations });
  }

  if (userData.weitereAngaben) {
    createWeitereAngabenAnhang(doc, documentStruct, userData);
  }

  createFooter(doc, documentStruct, "Anhang");
};

const requiresBelege = (userData: ProzesskostenhilfeFormularContext) =>
  Object.values(belegeStrings(userData)).some((val) => val === true);

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
      fillFooter,
    ],
  });

  const filledPdfFormDocument = await fillPdf({
    flowId: "/prozesskostenhilfe/formular",
    pdfValues,
    yPositionsDruckvermerk: [43, 51, 40, 44], // Different y positions because the form boxes jump for each page
    xPositionsDruckvermerk: 9,
  });

  printNameInSignatureFormField(filledPdfFormDocument, userData);

  const filledPdfFormDocumentWithMetadata = addMetadataToPdf(
    filledPdfFormDocument,
    METADATA,
  );

  if ((attachment && attachment.length > 0) || requiresBelege(userData)) {
    const pdfKitBuffer = await pdfFromUserData(
      userData,
      buildProzesskostenhilfePDFDocument,
      attachment,
      flowTranslations,
    );

    const mainPdfDocument = await PDFDocument.load(pdfKitBuffer);

    await appendPagesToPdf(filledPdfFormDocumentWithMetadata, mainPdfDocument);
  }

  await appendPagesToPdf(
    filledPdfFormDocumentWithMetadata,
    await loadHinweisblatt(),
  );

  return filledPdfFormDocumentWithMetadata.save();
}
