import { PDFDocument } from "pdf-lib";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { empfaengerIsChild } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/guards";
import { qualifiesForVereinfachteErklaerung } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/guards";
import { belegeStrings } from "~/domains/prozesskostenhilfe/formular/stringReplacements";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { fillZahlungsverpflichtungen } from "~/domains/prozesskostenhilfe/services/pdf/pdfForm/I_zahlungsverpflichtungen";
import { buildBelegeList } from "~/domains/prozesskostenhilfe/services/pdf/util";
import type { Metadata } from "~/services/pdf/addMetadataToPdf";
import { addMetadataToPdf } from "~/services/pdf/addMetadataToPdf";
import { appendPagesToPdf } from "~/services/pdf/appendPagesToPdf";
import { createAttachmentPages } from "~/services/pdf/attachment/createAttachmentPages";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import { fillPdf } from "~/services/pdf/fillPdf.server";
import {
  pdfFromUserData,
  type PDFDocumentBuilder,
} from "~/services/pdf/pdfFromUserData";
import { createVereinfachteErklaerungAnhang } from "./createVereinfachteErklaerungAnhang";
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
import { createWeitereAngabenAnhang } from "../../../../services/pdf/weitereAngabenAnhang/createWeitereAngabenAnhang";
import { createFooter } from "~/services/pdf/footer/createFooter";

const METADATA: Metadata = {
  AUTHOR: "Bundesministerium der Justiz",
  CREATOR: "service.justiz.de",
  KEYWORDS: ["Prozesskostenhilfe"],
  LANGUAGE: "de-DE",
  PRODUCER: "pdf-lib (https://github.com/Hopding/pdf-lib)",
  SUBJECT: "Erklärung über die persönlichen und wirtschaftlichen Verhältnisse",
  TITLE: "Erklärung über die persönlichen und wirtschaftlichen Verhältnisse",
};

const buildProzesskostenhilfePDFDocument: PDFDocumentBuilder<
  ProzesskostenhilfeFormularUserData
> = (doc, documentStruct, userData, attachment, translations) => {
  // Attachment holds content of form fields which is too long - output as needed
  createAttachmentPages({
    doc,
    documentStruct,
    userData,
    attachment,
    headerText:
      "Anhang: Erklärung über die persönlichen und wirtschaftlichen Verhältnisse bei Prozesskostenhilfe",
  });
  if (requiresBelege(userData)) {
    buildBelegeList({ doc, documentStruct, userData, translations });
  }

  if (userData.weitereAngaben) {
    createWeitereAngabenAnhang(doc, documentStruct, userData);
  }

  if (
    empfaengerIsChild({ context: userData }) &&
    qualifiesForVereinfachteErklaerung({ context: userData })
  ) {
    createVereinfachteErklaerungAnhang(doc, documentStruct, userData);
  }
  createFooter(doc, documentStruct, {}, undefined, "Anhang");
};

const requiresBelege = (userData: ProzesskostenhilfeFormularUserData) =>
  Object.values(belegeStrings(userData)).some((val) => val === true);

export async function prozesskostenhilfePdfFromUserdata(
  userData: ProzesskostenhilfeFormularUserData,
  sessionId: string,
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

  await printNameInSignatureFormField(filledPdfFormDocument, userData);

  const filledPdfFormDocumentWithMetadata = addMetadataToPdf(
    filledPdfFormDocument,
    METADATA,
  );

  const pdfKitBuffer = await pdfFromUserData(
    userData,
    buildProzesskostenhilfePDFDocument,
    attachment,
    flowTranslations,
  );

  if (userData.versandArt !== "digital") {
    const anhang = await appendPagesToPdf(
      await PDFDocument.load(pdfKitBuffer),
      await loadHinweisblatt(),
    );
    await appendPagesToPdf(
      filledPdfFormDocumentWithMetadata,
      await PDFDocument.load(anhang),
    );
  }

  return filledPdfFormDocumentWithMetadata.save();
}
