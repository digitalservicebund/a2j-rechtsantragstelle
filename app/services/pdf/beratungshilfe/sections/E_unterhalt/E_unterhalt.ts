import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { getAttachmentText } from "./getAttachmentText";
import {
  getListKidsUnterhaltPdfField,
  getListPersonUnterhaltPdfField,
} from "./unterhaltPdfField";
import type { Attachment } from "../../../attachment";

export const ATTACHMENT_DESCRIPTION_SECTION_E = "Feld E Unterhaltszahlungen";
export const SEE_IN_ATTACHMENT_DESCRIPTION = "Siehe Anhang";

export function fillUnterhalt(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const listPersonUnterhaltPdfField = getListPersonUnterhaltPdfField(context);
  const listKinderUnterhaltPdfField = getListKidsUnterhaltPdfField(context);

  const amountOfUnterhaltPdfFields =
    listPersonUnterhaltPdfField.length + listKinderUnterhaltPdfField.length;

  if (amountOfUnterhaltPdfFields === 0) return;

  pdfFields.e1Person1.value = SEE_IN_ATTACHMENT_DESCRIPTION;

  // Empty line
  attachment.push({
    title: "",
    text: "",
  });

  attachment.push({
    title: ATTACHMENT_DESCRIPTION_SECTION_E,
    text: getAttachmentText(
      listKinderUnterhaltPdfField,
      listPersonUnterhaltPdfField,
    ),
  });
}
