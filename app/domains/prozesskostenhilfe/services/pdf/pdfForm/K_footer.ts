import { today, toGermanDateFormat } from "~/util/date";
import { uppercaseFirstLetter } from "~/util/strings";
import type { PkhPdfFillFunction } from "../types";

export const fillFooter: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  pdfValues.ortDatum.value = `${uppercaseFirstLetter(userData.ort)}, ${toGermanDateFormat(
    today(),
  )}`;

  return { pdfValues };
};
