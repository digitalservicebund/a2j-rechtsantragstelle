import type { PkhPdfFillFunction } from "~/services/pdf/prozesskostenhilfe";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "../attachment";
import { getFillUnterhalt } from "../shared/unterhaltHelpers";
export const ATTACHMENT_DESCRIPTION_SECTION_D =
  "FELD D: Angehörige, denen Sie Bar- oder Naturalunterhalt gewähren";

export const fillUnterhaltAngehoerige: PkhPdfFillFunction = getFillUnterhalt(
  ATTACHMENT_DESCRIPTION_SECTION_D,
  (pdfValues) =>
    (pdfValues.angehoerigerNummereins.value = SEE_IN_ATTACHMENT_DESCRIPTION),
);
