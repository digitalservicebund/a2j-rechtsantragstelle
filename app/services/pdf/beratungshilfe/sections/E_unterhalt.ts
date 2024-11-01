import type { BerHPdfFillFunction } from "..";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "../../attachment";
import { getFillUnterhalt } from "../../shared/unterhaltHelpers";

export const ATTACHMENT_DESCRIPTION_SECTION_E = "Feld E: Unterhaltszahlungen";

export const fillUnterhalt: BerHPdfFillFunction = getFillUnterhalt(
  ATTACHMENT_DESCRIPTION_SECTION_E,
  (pdfValues) => {
    pdfValues.e1Person1.value = SEE_IN_ATTACHMENT_DESCRIPTION;
  },
);
