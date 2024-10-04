import type { PkhPdfFillFunction } from "~/services/pdf/prozesskostenhilfe";

export const fillGrundvoraussetzungen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (userData.gerichtName || userData.aktenzeichen) {
    pdfValues.bezeichnungOrtundGeschaeftsnummerdesGerichts.value = `${userData.gerichtName}, ${userData.aktenzeichen}`;
  }
  return { pdfValues };
};
