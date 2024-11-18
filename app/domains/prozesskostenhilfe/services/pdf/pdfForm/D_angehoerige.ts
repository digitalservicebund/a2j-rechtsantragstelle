import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/domains/shared/pdf/attachment";
import { getFillUnterhalt } from "~/domains/shared/pdf/unterhaltHelpers";
import type { PkhPdfFillFunction } from "..";
export const ATTACHMENT_DESCRIPTION_SECTION_D =
  "FELD D: Angehörige, denen Sie Bar- oder Naturalunterhalt gewähren";

export const fillUnterhaltAngehoerige: PkhPdfFillFunction = getFillUnterhalt(
  ATTACHMENT_DESCRIPTION_SECTION_D,
  (pdfValues) =>
    (pdfValues.angehoerigerNummereins.value = SEE_IN_ATTACHMENT_DESCRIPTION),
);
