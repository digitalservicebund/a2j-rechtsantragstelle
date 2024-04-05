import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { Attachment } from "../../attachment";
import {
  getListKidsUnterhaltPdfField,
  getListPersonUnterhaltPdfField,
} from "./unterhaltPdfField";
import { getAttachmentText } from "./getAttachmentText";
export const ATTACHMENT_DESCRIPTION_SECTION_E = "Feld E Unterhaltszahlungen";

export function fillUnterhalt(
  attachment: Attachment,
  context: BeratungshilfeFormularContext,
) {
  const listPersonUnterhaltPdfField = getListPersonUnterhaltPdfField(context);
  const listKinderUnterhaltPdfField = getListKidsUnterhaltPdfField(context);

  const amountOfUnterhaltPdfFields =
    listPersonUnterhaltPdfField.length + listKinderUnterhaltPdfField.length;

  if (amountOfUnterhaltPdfFields === 0) return;

  attachment.shouldCreateAttachment = true;

  attachment.descriptions.push({
    title: ATTACHMENT_DESCRIPTION_SECTION_E,
    text: getAttachmentText(
      listKinderUnterhaltPdfField,
      listPersonUnterhaltPdfField,
    ),
  });
}
