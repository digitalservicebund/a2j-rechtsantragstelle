import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import { newPageHint, type DescriptionField } from "../descriptionField";

export function fillAngelegenheit(
  descriptionField: DescriptionField,
  pdfFields: BeratungshilfePDF,
) {
  if (descriptionField.shouldCreateAttachment) {
    pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
      newPageHint;
  } else {
    pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
      descriptionField.descriptions
        .map((x) => `${x.title} ${x.text}`)
        .join("\n");
  }
}
