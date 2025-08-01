import { PDFDocument } from "pdf-lib";
import { getBeratungshilfeParameters } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import {
  getStaatlicheLeistungenStrings,
  weiteresEinkommenStrings,
  ausgabenStrings,
  getWeitereDokumenteStrings,
} from "~/domains/beratungshilfe/formular/stringReplacements";
import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { geldAnlagenStrings } from "~/domains/shared/formular/stringReplacements";
import {
  attachUserUploadedFilesToPdf,
  type RelevantFiles,
} from "~/domains/shared/services/pdf/userUploadedFiles/attachUserUploadedFilesToPdf";
import {
  addMetadataToPdf,
  type Metadata,
} from "~/services/pdf/addMetadataToPdf";
import { appendPagesToPdf } from "~/services/pdf/appendPagesToPdf";
import { createAttachmentPages } from "~/services/pdf/attachment/createAttachmentPages";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import { fillPdf } from "~/services/pdf/fillPdf.server";
import { createFooter } from "~/services/pdf/footer/createFooter";
import type { PDFDocumentBuilder } from "~/services/pdf/pdfFromUserData";
import { pdfFromUserData } from "~/services/pdf/pdfFromUserData";
import { createWeitereAngabenAnhang } from "~/services/pdf/weitereAngabenAnhang/createWeitereAngabenAnhang";
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
  BeratungshilfeFormularUserData
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
  }

  if (userData.weitereAngaben) {
    createWeitereAngabenAnhang(doc, documentStruct, userData);
  }

  doc.addPage();

  // Checklist will always be output
  createChecklistPage(doc, documentStruct, userData);
  createFooter(doc, documentStruct, "Anhang");
};

export async function beratungshilfePdfFromUserdata(
  userData: BeratungshilfeFormularUserData,
  sessionId: string,
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

  if (userData.abgabeArt === "online") {
    const userFilesPdfBuffer = await attachUserUploadedFilesToPdf(
      pdfKitBuffer,
      sessionId,
      "/beratungshilfe/antrag",
      relevantBeratungshilfeFilesList(userData),
    );
    const userFilesPdfDocument = await PDFDocument.load(userFilesPdfBuffer);
    return appendPagesToPdf(
      filledPdfFormDocumentWithMetadata,
      userFilesPdfDocument,
    );
  }
  return appendPagesToPdf(filledPdfFormDocumentWithMetadata, mainPdfDocument);
}

function relevantBeratungshilfeFilesList(
  userData: BeratungshilfeFormularUserData,
): RelevantFiles {
  const leistungen = getStaatlicheLeistungenStrings(userData);
  const weiteresEinkommen = weiteresEinkommenStrings(userData);
  const ausgaben = ausgabenStrings(userData);
  const geldAnlagen = geldAnlagenStrings(userData);
  const weitereDokumente = getWeitereDokumenteStrings(userData);

  return [
    [weiteresEinkommen.wohngeld, userData.wohngeldBeweis],
    [weiteresEinkommen.bafoeg, userData.bafoegBeweis],
    [weiteresEinkommen.krankengeld, userData.krankengeldBeweis],
    [weiteresEinkommen.elterngeld, userData.elterngeldBeweis],
    [leistungen.hasBuergergeld, userData.buergergeldBeweis],
    [
      leistungen.hasAsylbewerberleistungen,
      userData.asylbewerberleistungenBeweis,
    ],
    [leistungen.hasNoSozialleistung, userData.keineLeistungenBeweis],
    [leistungen.hasGrundsicherung, userData.grundsicherungBeweis],
    [geldAnlagen.hasLebensversicherung, userData.lebensversicherungBeweis],
    [geldAnlagen.hasBausparvertrag, userData.bausparvertragBeweis],
    [geldAnlagen.hasWertpapiere, userData.wertpapiereBeweis],
    [geldAnlagen.hasGutenhabenKrypto, userData.guthabenkontoBeweis],
    [geldAnlagen.hasGiroTagesSparkonto, userData.sparkontoBeweis],
    [geldAnlagen.hasGrundeigentum, userData.grundeigentumBeweis],
    [ausgaben.hasSchwangerschaft, userData.schwangerschaftAngabeBeweis],
    [ausgaben.hasSchwerbehinderung, userData.schwerbehinderungBeweis],
    [ausgaben.hasMedicalReasons, userData.medizinischeGruendeBeweis],
    [ausgaben.hasWeitereAusgaben, userData.weitereAusgabenBeweis],
    [weitereDokumente.hasWeitereDokumente, userData.weitereDokumenteBeweis],
  ];
}
