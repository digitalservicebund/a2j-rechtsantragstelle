import type { BerHPdfFillFunction } from "..";
import type { AttachmentEntries } from "../../attachment";

export const fillWohnen: BerHPdfFillFunction = ({ userData, pdfValues }) => {
  const attachment: AttachmentEntries = [];
  pdfValues.d1Wohnung.value = userData.apartmentSizeSqm?.toString();
  pdfValues.d2Wohnkosten.value =
    userData.apartmentCostAlone ?? userData.apartmentCostFull;

  if (userData.apartmentCostOwnShare) {
    pdfValues.d2Wohnkosten.value = "s. Anhang";
    attachment.push(
      { title: "Feld D: Wohnen", level: "h2" },
      {
        title: "Wohnungsgröße",
        text: userData.apartmentSizeSqm?.toString() + " m²",
      },
      {
        title: "Wohnungskosten gesamt (monatlich)",
        text: userData.apartmentCostFull + " €",
      },
      {
        title: "Eigene Wohnungskosten (monatlich)",
        text: userData.apartmentCostOwnShare + " €",
      },
      {
        title: "Anzahl weiterer Personen in Wohnung",
        text: userData.apartmentPersonCount?.toString(),
      },
    );
  }

  const livesAlone = userData.livingSituation === "alone";
  pdfValues.d4Wohnungalleine.value = livesAlone;
  pdfValues.d5Wohnunggemeinsam.value = !livesAlone;
  pdfValues.d6WonungweiterePersonen.value =
    userData.apartmentPersonCount?.toString();

  return { pdfValues, attachment };
};
