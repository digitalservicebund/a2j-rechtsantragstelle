import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import type { PkhPdfFillFunction } from "~/services/pdf/prozesskostenhilfe";
import type { AttachmentEntries } from "../attachment";
import { fillPdfFieldOrMoveToAttachment } from "../fillPdfFieldOrMoveToAttachment";
import { maritalDescriptionMapping } from "../shared/maritalDescriptionMapping";

export const GESETZLICHERVERTRETER_FIELD_MAX_CHARS = 80;
export const NAME_VORNAME_FIELD_MAX_CHARS = 35;
export const ANSCHRIFT_FIELD_MAX_CHARS = 50;
export const FAMILIENSTAND_FIELD_MAX_CHARS = 10;

export const concatenateGesetzlicherVertreterString = (
  userData: ProzesskostenhilfeFormularContext,
): string => {
  const { nachname, vorname, strasseHausnummer, plz, ort, telefonnummer } =
    userData?.gesetzlicheVertretungDaten || {};
  return `${nachname} ${vorname}, ${strasseHausnummer}, ${plz} ${ort}, ${telefonnummer}`;
};

export const concatenateNameVornameString = (
  userData: ProzesskostenhilfeFormularContext,
): string => {
  const { nachname, vorname } = userData;
  return `${nachname}, ${vorname}`;
};

export const concatenateAnschriftString = (
  userData: ProzesskostenhilfeFormularContext,
): string => {
  const { strasseHausnummer, plz, ort } = userData;
  return `${strasseHausnummer}, ${plz} ${ort}`;
};

export const fillPerson: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  const attachment: AttachmentEntries = [];

  const nameVornameString = concatenateNameVornameString(userData);
  const anschriftString = concatenateAnschriftString(userData);
  const gesetzlicherVertreterString =
    concatenateGesetzlicherVertreterString(userData);

  fillPdfFieldOrMoveToAttachment<ProzesskostenhilfePDF>({
    pdfFieldName: "nameVornameggfGeburtsname",
    pdfFieldValue: nameVornameString,
    pdfFieldMaxChars: NAME_VORNAME_FIELD_MAX_CHARS,
    attachmentTitle: "Name, Vorname, ggf. Geburtsname",
    pdfValues,
    attachment,
  });

  fillPdfFieldOrMoveToAttachment<ProzesskostenhilfePDF>({
    pdfFieldName: "berufErwerbstaetigkeit",
    pdfFieldValue: userData?.beruf,
    pdfFieldMaxChars: NAME_VORNAME_FIELD_MAX_CHARS,
    attachmentTitle: "Beruf, Erwerbstätigkeit",
    pdfValues,
    attachment,
  });

  pdfValues.geburtsdatum.value = userData?.geburtsdatum;

  fillPdfFieldOrMoveToAttachment<ProzesskostenhilfePDF>({
    pdfFieldName: "text3",
    pdfFieldValue: maritalDescriptionMapping[userData.partnerschaft ?? ""],
    pdfFieldMaxChars: FAMILIENSTAND_FIELD_MAX_CHARS,
    attachmentTitle: "Familienstand",
    pdfValues,
    attachment,
    attachmentPageHint: "s.A.",
  });

  fillPdfFieldOrMoveToAttachment<ProzesskostenhilfePDF>({
    pdfFieldName: "anschriftStrasseHausnummerPostleitzahlWohnort",
    pdfFieldValue: anschriftString,
    pdfFieldMaxChars: ANSCHRIFT_FIELD_MAX_CHARS,
    attachmentTitle: "Anschrift (Straße, Hausnummer, Postleitzahl Wohnort)",
    pdfValues,
    attachment,
  });

  pdfValues.text2.value = userData?.telefonnummer;

  fillPdfFieldOrMoveToAttachment<ProzesskostenhilfePDF>({
    pdfFieldName:
      "sofernvorhandenGesetzlicherVertreterNameVornameAnschriftTelefon",
    pdfFieldValue: gesetzlicherVertreterString,
    pdfFieldMaxChars: GESETZLICHERVERTRETER_FIELD_MAX_CHARS,
    attachmentTitle: "Gesetzlicher Vertreter",
    pdfValues,
    attachment,
  });

  if (attachment.length > 0) {
    attachment.unshift({
      title: "Feld A: Angaben zu Ihrer Person",
      level: "h2",
    });
  }

  return { pdfValues, attachment };
};
