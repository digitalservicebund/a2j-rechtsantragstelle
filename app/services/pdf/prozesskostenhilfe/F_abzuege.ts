import type { PkhPdfFillFunction } from "./fillOutFunction";

export const fillAbzuege: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  if (userData.hasAusgaben !== "yes") return { pdfValues }; // TODO: remove after pruning

  pdfValues.sonstigeVersicherungen.value = userData.versicherungen
    ?.map(
      (versicherung) =>
        `${versicherung.art !== "sonstige" ? versicherung.art : versicherung.sonstigeArt}: ${versicherung.beitrag} €`,
    )
    .join("\n");

  return { pdfValues };
};
