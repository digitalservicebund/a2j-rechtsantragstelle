import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import {
  type AttachmentEntries,
  SEE_IN_ATTACHMENT_DESCRIPTION,
} from "~/domains/shared/services/pdf/attachment";
import { maritalDescriptionMapping } from "~/domains/shared/services/pdf/maritalDescriptionMapping";
import type { PkhPdfFillFunction } from "..";

export const GESETZLICHERVERTRETER_FIELD_MAX_CHARS = 80;
export const NAME_VORNAME_FIELD_MAX_CHARS = 35;
export const ANSCHRIFT_FIELD_MAX_CHARS = 50;
export const FAMILIENSTAND_FIELD_MAX_CHARS = 10;
export const BERUF_FIELD_MAX_CHARS = 25;

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

  if (nameVornameString.length > NAME_VORNAME_FIELD_MAX_CHARS) {
    attachment.push({
      title: "Name, Vorname, ggf. Geburtsname",
      text: nameVornameString,
    });
    pdfValues.nameVornameggfGeburtsname.value = SEE_IN_ATTACHMENT_DESCRIPTION;
  } else {
    pdfValues.nameVornameggfGeburtsname.value = nameVornameString;
  }

  if (userData.beruf && userData.beruf.length > BERUF_FIELD_MAX_CHARS) {
    attachment.push({
      title: "Beruf, Erwerbstätigkeit",
      text: userData.beruf,
    });
    pdfValues.berufErwerbstaetigkeit.value = SEE_IN_ATTACHMENT_DESCRIPTION;
  } else {
    pdfValues.berufErwerbstaetigkeit.value = userData.beruf;
  }

  pdfValues.geburtsdatum.value = userData?.geburtsdatum;

  const maritalDescription =
    maritalDescriptionMapping[userData.partnerschaft ?? ""];
  if (maritalDescription.length > FAMILIENSTAND_FIELD_MAX_CHARS) {
    attachment.push({
      title: "Familienstand",
      text: maritalDescription,
    });
    pdfValues.text3.value = "s.A.";
  } else {
    pdfValues.text3.value = maritalDescription;
  }

  if (anschriftString.length > ANSCHRIFT_FIELD_MAX_CHARS) {
    attachment.push({
      title: "Anschrift (Straße, Hausnummer, Postleitzahl Wohnort)",
      text: anschriftString,
    });
    pdfValues.anschriftStrasseHausnummerPostleitzahlWohnort.value =
      SEE_IN_ATTACHMENT_DESCRIPTION;
  } else {
    pdfValues.anschriftStrasseHausnummerPostleitzahlWohnort.value =
      anschriftString;
  }

  pdfValues.text2.value = userData?.telefonnummer;

  if (
    gesetzlicherVertreterString.length > GESETZLICHERVERTRETER_FIELD_MAX_CHARS
  ) {
    attachment.push({
      title: "Gesetzlicher Vertreter",
      text: gesetzlicherVertreterString,
    });
    pdfValues.sofernvorhandenGesetzlicherVertreterNameVornameAnschriftTelefon.value =
      SEE_IN_ATTACHMENT_DESCRIPTION;
  } else {
    pdfValues.sofernvorhandenGesetzlicherVertreterNameVornameAnschriftTelefon.value =
      gesetzlicherVertreterString;
  }

  if (attachment.length > 0) {
    attachment.unshift({
      title: "Feld A: Angaben zu Ihrer Person",
      level: "h2",
    });
  }

  return { pdfValues, attachment };
};
