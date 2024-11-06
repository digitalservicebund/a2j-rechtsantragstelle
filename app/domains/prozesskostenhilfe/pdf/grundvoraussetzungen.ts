import type { PkhPdfFillFunction } from "~/domains/prozesskostenhilfe/pdf";

export const fillGrundvoraussetzungen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  let gerichtInfo = "";
  if (userData.gerichtName) {
    gerichtInfo += userData.gerichtName;
    if (userData.aktenzeichen) {
      gerichtInfo += `, ${userData.aktenzeichen}`;
    }
  } else if (userData.aktenzeichen) {
    gerichtInfo += userData.aktenzeichen;
  }
  pdfValues.bezeichnungOrtundGeschaeftsnummerdesGerichts.value = gerichtInfo;
  return { pdfValues };
};
