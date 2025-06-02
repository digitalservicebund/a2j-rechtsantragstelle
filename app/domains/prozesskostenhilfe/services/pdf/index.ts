import { PDFDocument } from "pdf-lib";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { belegeStrings } from "~/domains/prozesskostenhilfe/formular/stringReplacements";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { fillZahlungsverpflichtungen } from "~/domains/prozesskostenhilfe/services/pdf/pdfForm/I_zahlungsverpflichtungen";
import { buildBelegeList } from "~/domains/prozesskostenhilfe/services/pdf/util";
import {
  attachUserUploadedFilesToPdf,
  type RelevantFiles,
} from "~/domains/shared/services/pdf/userUploadedFiles/attachUserUploadedFilesToPdf";
import type { Metadata } from "~/services/pdf/addMetadataToPdf";
import { addMetadataToPdf } from "~/services/pdf/addMetadataToPdf";
import { appendPagesToPdf } from "~/services/pdf/appendPagesToPdf";
import { createAttachmentPages } from "~/services/pdf/attachment/createAttachmentPages";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
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
import { createWeitereAngabenAnhang } from "../../../../services/pdf/weitereAngabenAnhang/createWeitereAngabenAnhang";

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
  ProzesskostenhilfeFormularUserData
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

  if (userData.versandArt === "digital") {
    const userFilesPdfBuffer = await attachUserUploadedFilesToPdf(
      pdfKitBuffer,
      sessionId,
      "/prozesskostenhilfe/formular",
      relevantProzesskostenhilfeFilesList(userData),
    );
    const userFilesDocument = await PDFDocument.load(userFilesPdfBuffer);
    await appendPagesToPdf(
      filledPdfFormDocumentWithMetadata,
      userFilesDocument,
    );
  } else {
    await appendPagesToPdf(
      filledPdfFormDocumentWithMetadata,
      await loadHinweisblatt(),
    );
  }

  return filledPdfFormDocumentWithMetadata.save();
}

function relevantProzesskostenhilfeFilesList(
  userData: ProzesskostenhilfeFormularUserData,
): RelevantFiles {
  const {
    rsvDeckung,
    rsvOrgDeckung,
    hasBuergergeld,
    hasArbeitslosengeld,
    hasGrundsicherung,
    hasAsylbewerberleistungen,
    isAngestellt,
    isSelbstaendig,
    hasAbzuege,
    hasWerbungskosten,
    hasRente,
    hasWohngeld,
    hasKrankengeld,
    hasElterngeld,
    hasWeitereEinkuenfte,
    partnerHasBuergergeld,
    partnerHasArbeitslosengeld,
    partnerHasAsylbewerberleistungen,
    partnerHasGrundsicherung,
    partnerIsAngestellt,
    partnerIsSelbststaendig,
    partnerHasAbzuege,
    partnerHasWerbungskosten,
    partnerHasRente,
    partnerHasWohngeld,
    partnerHasKrankengeld,
    partnerHasElterngeld,
    partnerWeitereEinkuenfte,
    isRenter,
    isHomeowner,
    hasGrundeigentum,
    hasKraftfahrzeug,
    hasWertpapier,
    hasGeldanlageBefristet,
    hasGeldanlageSonstige,
    hasGuthabenKryptoKonto,
    hasGiroTagesSparKonto,
    hasSchwangerschaft,
    hasSchwerbehinderung,
    hasKostenaufwaendigeErnaehrung,
    hasVersicherung,
    hasRatenzahlung,
    hasSonstigeAusgaben,
    hasWeitereDokumente,
  } = belegeStrings(userData);
  return [
    [rsvDeckung, userData.rechtsschutzversicherungDeckungBeweis],
    [rsvOrgDeckung, userData.organisationDeckungBeweis],
    [hasBuergergeld, userData.buergergeldBeweis],
    [hasArbeitslosengeld, userData.arbeitslosengeldBeweis],
    [hasGrundsicherung, userData.grundsicherungSozialhilfeBeweis],
    [hasAsylbewerberleistungen, userData.asylbewerberleistungBeweis],
    [isAngestellt, userData.einkommenAngestelltBeweis],
    [isSelbstaendig, userData.einkommenSelbststaendigBeweis],
    [hasAbzuege, userData.abzuegeBeweis],
    [hasWerbungskosten, userData.werbungskostenBeweis],
    [hasRente, userData.renteBeweis],
    [hasWohngeld, userData.wohngeldBeweis],
    [hasKrankengeld, userData.krankengeldBeweis],
    [hasElterngeld, userData.elterngeldBeweis],
    [hasWeitereEinkuenfte, userData.weitereEinkuenfteBeweis],
    [partnerHasBuergergeld, userData.buergergeldPartnerBeweis],
    [partnerHasArbeitslosengeld, userData.arbeitslosengeldPartnerBeweis],
    [
      partnerHasAsylbewerberleistungen,
      userData.asylbewerberleistungPartnerBeweis,
    ],
    [partnerHasGrundsicherung, userData.grundsicherungSozialhilfePartnerBeweis],
    [partnerIsAngestellt, userData.einkommenAngestelltPartnerBeweis],
    [partnerIsSelbststaendig, userData.einkommenSelbststaendigPartnerBeweis],
    [partnerHasAbzuege, userData.abzuegePartnerBeweis],
    [partnerHasWerbungskosten, userData.werbungskostenPartnerBeweis],
    [partnerHasRente, userData.rentePartnerBeweis],
    [partnerHasWohngeld, userData.wohngeldPartnerBeweis],
    [partnerHasKrankengeld, userData.krankengeldPartnerBeweis],
    [partnerHasElterngeld, userData.elterngeldPartnerBeweis],
    [partnerWeitereEinkuenfte, userData.weitereEinkuenftePartnerBeweis],
    [isRenter, userData.renteBeweis],
    [isHomeowner, userData.wohngeldBeweis],
    [hasGrundeigentum, userData.grundeigentumBeweis],
    [hasKraftfahrzeug, userData.kraftfahrzeugeBeweis],
    [hasWertpapier, userData.wertpapiereBeweis],
    [hasGeldanlageBefristet, userData.geldanlagenBefristetBeweis],
    [hasGeldanlageSonstige, userData.geldanlagenSonstigeBeweis],
    [hasGuthabenKryptoKonto, userData.guthabenkontoKryptowaehrungBeweis],
    [hasGiroTagesSparKonto, userData.sparkontenBeweis],
    [hasSchwangerschaft, userData.schwangerschaftBeweis],
    [hasSchwerbehinderung, userData.schwerbehinderungBeweis],
    [
      hasKostenaufwaendigeErnaehrung,
      userData.kostenaufwaendigeErnaehrungBeweis,
    ],
    [hasVersicherung, userData.versicherungenBeweis],
    [hasRatenzahlung, userData.ratenzahlungenBeweis],
    [hasSonstigeAusgaben, userData.sonstigeAusgabenBeweis],
    [hasWeitereDokumente, userData.weitereDokumenteBeweis],
  ];
}
