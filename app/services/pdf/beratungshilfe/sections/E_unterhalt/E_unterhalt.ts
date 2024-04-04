import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { Attachment } from "../../attachment";
import {
  getListKidsUnterhaltPdfField,
  getListPersonUnterhaltPdfField,
} from "./unterhaltPdfField";
import { getAttachmentText } from "./getAttachmentText";
import { fillPdf } from "./fillPdf";

const MAX_SECTION_E_LIST = 4;
export const ATTACHMENT_DESCRIPTION_SECTION_E = "Feld E Unterhaltszahlungen";

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

  if (amountOfUnterhaltPdfFields <= MAX_SECTION_E_LIST) {
    fillPdf(
      listPersonUnterhaltPdfField,
      listKinderUnterhaltPdfField,
      pdfFields,
    );
  } else {
    attachment.shouldCreateAttachment = true;

    attachment.descriptions.push({
      title: ATTACHMENT_DESCRIPTION_SECTION_E,
      text: getAttachmentText(
        listKinderUnterhaltPdfField,
        listPersonUnterhaltPdfField,
      ),
    });
  }
}
