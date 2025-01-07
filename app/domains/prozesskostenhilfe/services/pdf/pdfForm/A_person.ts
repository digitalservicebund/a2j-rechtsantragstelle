import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { maritalDescriptionMapping } from "~/domains/shared/services/pdf/maritalDescriptionMapping";
import { type AttachmentEntries } from "~/services/pdf/attachment";
import { fillPdfField } from "~/services/pdf/fillPdfField";
import type { PkhPdfFillFunction } from "..";

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

  fillPdfField({
    fieldname: "nameVornameggfGeburtsname",
    value: nameVornameString,
    attachmentTitle: "Name, Vorname, ggf. Geburtsname",
    pdfValues,
    attachment,
  });

  fillPdfField({
    fieldname: "berufErwerbstaetigkeit",
    value: userData?.beruf,
    attachmentTitle: "Beruf, Erwerbstätigkeit",
    pdfValues,
    attachment,
  });

  pdfValues.geburtsdatum.value = userData?.geburtsdatum;

  fillPdfField({
    fieldname: "text3",
    value: maritalDescriptionMapping[userData.partnerschaft ?? ""],
    attachmentTitle: "Familienstand",
    pdfValues,
    attachment,
  });

  fillPdfField({
    fieldname: "anschriftStrasseHausnummerPostleitzahlWohnort",
    value: anschriftString,
    attachmentTitle: "Anschrift (Straße, Hausnummer, Postleitzahl Wohnort)",
    pdfValues,
    attachment,
  });

  pdfValues.text2.value = userData?.telefonnummer;

  fillPdfField({
    fieldname:
      "sofernvorhandenGesetzlicherVertreterNameVornameAnschriftTelefon",
    value: gesetzlicherVertreterString,
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
