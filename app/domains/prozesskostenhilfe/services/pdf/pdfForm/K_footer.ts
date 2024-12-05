import { today, toGermanDateFormat } from "~/util/date";
import { uppercaseFirstLetter } from "~/util/strings";
import type { PkhPdfFillFunction } from "..";

export const fillFooter: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  pdfValues.ortundDatum.value = `${uppercaseFirstLetter(userData.ort)}, ${toGermanDateFormat(
    today(),
  )}`;

  return { pdfValues };
};
