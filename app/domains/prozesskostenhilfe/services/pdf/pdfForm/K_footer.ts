import { today, toGermanDateString } from "~/util/date";
import { uppercaseFirstLetter } from "~/util/strings";
import type { PkhPdfFillFunction } from "../types";

export const fillFooter: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  pdfValues.ortDatum.value = `${uppercaseFirstLetter(userData.ort)}, ${toGermanDateString(
    today(),
  )}`;

  return { pdfValues };
};
