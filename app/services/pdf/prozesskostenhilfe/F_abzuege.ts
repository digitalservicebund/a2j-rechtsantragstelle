import type { PdfFillFunction } from "./fillOutFunction";

export const fillAbzuege: PdfFillFunction = ({
  userdata,
  pdfValues,
  attachment,
}) => {
  if (userdata.hasAusgaben !== "yes") return { pdfValues }; // TODO: remove after pruning

  pdfValues.sonstigeVersicherungen.value = userdata.versicherungen
    ?.map(
      (versicherung) =>
        `${versicherung.art !== "sonstige" ? versicherung.art : versicherung.sonstigeArt}: ${versicherung.beitrag} €`,
    )
    .join("\n");

  return { pdfValues, attachment };
};
