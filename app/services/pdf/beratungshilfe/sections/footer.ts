import { today, toGermanDateFormat } from "~/util/date";
import { uppercaseFirstLetter } from "~/util/strings";
import type { BerHPdfFillFunction } from "..";

export const fillFooter: BerHPdfFillFunction = ({ userData, pdfValues }) => {
  if (userData.anwaltskanzlei === "yes") {
    if (userData.beratungStattgefunden === "no") {
      pdfValues.beratungsperson.value =
        "Kontakt mit Kanzlei bereits aufgenommen, aber eine Beratung hat noch nicht stattgefunden";
    } else if (userData.beratungStattgefunden === "yes") {
      pdfValues.beratungsperson.value = [
        userData.anwaltName,
        userData.anwaltStrasseUndHausnummer,
        `${userData.anwaltPlz} ${userData.anwaltOrt}`,
      ].join(", ");
      pdfValues.datumBeratung.value = userData.beratungStattgefundenDatum ?? "";
    }
  }
  pdfValues.ortDatum2.value = `${uppercaseFirstLetter(userData.ort)}, ${toGermanDateFormat(
    today(),
  )}`;

  if (userData.abgabeArt === "online") {
    pdfValues.unterschriftdesAntragstellersderAntragstellerin.value = `${userData.vorname ?? ""} ${userData.nachname ?? ""}`;
  }
  return { pdfValues };
};
