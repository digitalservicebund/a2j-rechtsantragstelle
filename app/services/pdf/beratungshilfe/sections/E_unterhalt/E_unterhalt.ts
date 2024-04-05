import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { Attachment } from "../../attachment";
import {
  getListKidsUnterhaltPdfField,
  getListPersonUnterhaltPdfField,
} from "./unterhaltPdfField";
import { getAttachmentText } from "./getAttachmentText";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";

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

  attachment.shouldCreateAttachment = true;
  pdfFields.e1Person1.value = SEE_IN_ATTACHMENT_DESCRIPTION;

  attachment.descriptions.push({
    title: "",
    text: "",
  });

  attachment.descriptions.push({
    title: ATTACHMENT_DESCRIPTION_SECTION_E,
    text: getAttachmentText(
      listKinderUnterhaltPdfField,
      listPersonUnterhaltPdfField,
    ),
  });
}
