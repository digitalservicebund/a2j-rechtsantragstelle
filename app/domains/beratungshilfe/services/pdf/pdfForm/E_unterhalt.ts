import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/domains/shared/services/pdf/attachment";
import { getFillUnterhalt } from "~/domains/shared/services/pdf/unterhaltHelpers";
import type { BerHPdfFillFunction } from "..";

export const ATTACHMENT_DESCRIPTION_SECTION_E = "Feld E: Unterhaltszahlungen";

export const fillUnterhalt: BerHPdfFillFunction = getFillUnterhalt(
  ATTACHMENT_DESCRIPTION_SECTION_E,
  (pdfValues) => {
    pdfValues.e1Person1.value = SEE_IN_ATTACHMENT_DESCRIPTION;
  },
);
