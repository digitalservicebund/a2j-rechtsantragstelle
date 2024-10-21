import type { PkhPdfFillFunction } from "~/services/pdf/prozesskostenhilfe";

export const fillRechtsschutzversicherung: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (userData.hasRsv === "yes" || userData.hasRsvThroughOrg === "yes") {
    const rsvString = userData.hasRsv === "yes" ? "RSV" : "Verein/Organisation";
    if (
      userData.hasRsvCoverage === "partly" ||
      userData.hasOrgCoverage === "partly"
    ) {
      pdfValues.ja.value = true;
      pdfValues.hoehederKosten.value = `${rsvString}: Teilweise Kostenübernahme (siehe Belege)`;
    } else if (
      userData.hasRsvCoverage === "no" ||
      userData.hasOrgCoverage === "no"
    ) {
      pdfValues["1Nein"].value = true;
      pdfValues.ja_2.value = true;
      pdfValues.bezeichnungderVersicherung.value = `${rsvString}: Ja (siehe Belege)`;
    }
  } else {
    pdfValues["1Nein"].value = true;
    pdfValues.nein_3.value = true;
  }
  return {
    pdfValues,
  };
};
