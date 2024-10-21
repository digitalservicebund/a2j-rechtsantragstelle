import type { PkhPdfFillFunction } from "~/services/pdf/prozesskostenhilfe";

export const fillRechtsschutzversicherung: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (userData.hasRsv === "yes") {
    if (userData.hasRsvCoverage === "partly") {
      pdfValues.ja.value = true;
      pdfValues.hoehederKosten.value =
        "RSV: Teilweise Kostenübernahme (siehe Belege)";
    } else if (userData.hasRsvCoverage === "no") {
      pdfValues["1Nein"].value = true;
      pdfValues.ja_2.value = true;
      pdfValues.bezeichnungderVersicherung.value = "RSV: Ja (siehe Belege)";
    }
  } else if (userData.hasRsvThroughOrg === "yes") {
    if (userData.hasOrgCoverage === "partly") {
      pdfValues.ja.value = true;
      pdfValues.hoehederKosten.value =
        "Verein/Organisation: Teilweise Kostenübernahme (siehe Belege)";
    } else if (userData.hasOrgCoverage === "no") {
      pdfValues["1Nein"].value = true;
      pdfValues.ja_2.value = true;
      pdfValues.bezeichnungderVersicherung.value =
        "Verein/Organisation: Ja (siehe Belege)";
    }
  } else {
    pdfValues["1Nein"].value = true;
    pdfValues.nein_3.value = true;
  }
  return {
    pdfValues,
  };
};
