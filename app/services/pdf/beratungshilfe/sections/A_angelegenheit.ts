import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import { newPageHint, type Attachment } from "../attachment";

export function fillAngelegenheit(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
) {
  if (attachment.shouldCreateAttachment) {
    pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
      newPageHint;
  } else {
    pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
      attachment.descriptions.map((x) => `${x.title} ${x.text}`).join("\n");
  }
}
