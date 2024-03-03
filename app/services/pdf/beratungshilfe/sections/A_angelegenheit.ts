import type { BeratungshilfePDF } from "../beratungshilfe.generated";
import type { Attachment } from "../attachment";

export function fillAngelegenheit(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
) {
  pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
    attachment.descriptions.map((x) => `${x.title} ${x.text} `).join("\n");
}
