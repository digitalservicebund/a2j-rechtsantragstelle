import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { maritalDescriptionMapping } from "~/domains/shared/pdf/maritalDescriptionMapping";
import { type AttachmentEntries } from "~/services/pdf/attachment";
import { fillPdfFieldOrMoveToAttachment } from "~/services/pdf/fillPdfFieldOrMoveToAttachment";
import type { PkhPdfFillFunction } from ".";

export const concatenateGesetzlicherVertreterString = ({
  gesetzlicheVertretungDaten,
}: ProzesskostenhilfeFormularContext): string => {
  if (!gesetzlicheVertretungDaten) return "";

  const { nachname, vorname, strasseHausnummer, plz, ort, telefonnummer } =
    gesetzlicheVertretungDaten;
  return `${nachname} ${vorname}, ${strasseHausnummer}, ${plz} ${ort}, ${telefonnummer ?? ""}`;
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

  fillPdfFieldOrMoveToAttachment({
    pdfFieldName: "nameVornameggfGeburtsname",
    pdfFieldValue: nameVornameString,
    attachmentTitle: "Name, Vorname, ggf. Geburtsname",
    pdfValues,
    attachment,
  });

  fillPdfFieldOrMoveToAttachment({
    pdfFieldName: "berufErwerbstaetigkeit",
    pdfFieldValue: userData?.beruf,
    attachmentTitle: "Beruf, Erwerbstätigkeit",
    pdfValues,
    attachment,
  });

  pdfValues.geburtsdatum.value = userData?.geburtsdatum;

  fillPdfFieldOrMoveToAttachment({
    pdfFieldName: "text3",
    pdfFieldValue: maritalDescriptionMapping[userData.partnerschaft ?? ""],
    attachmentTitle: "Familienstand",
    pdfValues,
    attachment,
  });

  fillPdfFieldOrMoveToAttachment({
    pdfFieldName: "anschriftStrasseHausnummerPostleitzahlWohnort",
    pdfFieldValue: anschriftString,
    attachmentTitle: "Anschrift (Straße, Hausnummer, Postleitzahl Wohnort)",
    pdfValues,
    attachment,
  });

  pdfValues.text2.value = userData?.telefonnummer;

  fillPdfFieldOrMoveToAttachment({
    pdfFieldName:
      "sofernvorhandenGesetzlicherVertreterNameVornameAnschriftTelefon",
    pdfFieldValue: gesetzlicherVertreterString,
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
