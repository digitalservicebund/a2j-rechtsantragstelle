import { getFillUnterhalt } from "~/domains/shared/services/pdf/unterhaltHelpers";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/services/pdf/attachment";
import type { PkhPdfFillFunction } from "../types";
export const ATTACHMENT_DESCRIPTION_SECTION_D =
  "FELD D: Angehörige, denen Sie Bar- oder Naturalunterhalt gewähren";

export const fillUnterhaltAngehoerige: PkhPdfFillFunction = getFillUnterhalt(
  ATTACHMENT_DESCRIPTION_SECTION_D,
  (pdfValues) =>
    (pdfValues.angehoerigerNummereins.value = SEE_IN_ATTACHMENT_DESCRIPTION),
);
