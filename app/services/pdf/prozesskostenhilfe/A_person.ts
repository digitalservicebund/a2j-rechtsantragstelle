import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import type { PkhPdfFillFunction } from "~/services/pdf/prozesskostenhilfe";
import type { AttachmentEntries } from "../attachment";
import { newPageHint } from "../attachment";

export const GESETZLICHERVERTRETER_FIELD_MAX_CHARS = 80;

export const concatenateGesetzlicherVertreterString = (
  userData: ProzesskostenhilfeFormularContext,
): string => {
  const { vorname, nachname, strasseHausnummer, plz, ort, telefonnummer } =
    userData.gesetzlicheVertretungDaten!;
  return `${vorname} ${nachname}, ${strasseHausnummer}, ${plz} ${ort}, ${telefonnummer}`;
};

export const fillPerson: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  const attachment: AttachmentEntries = [];

  const gesetzlicherVertreterString =
    `${userData.gesetzlicheVertretungDaten?.vorname} ${userData.gesetzlicheVertretungDaten?.nachname}, ` +
    `${userData.gesetzlicheVertretungDaten?.strasseHausnummer}, ` +
    `${userData.gesetzlicheVertretungDaten?.plz} ${userData.gesetzlicheVertretungDaten?.ort}, ` +
    `${userData.gesetzlicheVertretungDaten?.telefonnummer}`;

  if (
    gesetzlicherVertreterString.length > GESETZLICHERVERTRETER_FIELD_MAX_CHARS
  ) {
    pdfValues.sofernvorhandenGesetzlicherVertreterNameVornameAnschriftTelefon.value =
      newPageHint;

    attachment.push({
      title: "Feld A: Angaben zu Ihrer Person",
      level: "h2",
    });

    attachment.push({
      title: "Gesetzlicher Vertreter",
      text: gesetzlicherVertreterString,
    });
  } else {
    pdfValues.sofernvorhandenGesetzlicherVertreterNameVornameAnschriftTelefon.value =
      gesetzlicherVertreterString;
  }

  return { pdfValues, attachment };
};
