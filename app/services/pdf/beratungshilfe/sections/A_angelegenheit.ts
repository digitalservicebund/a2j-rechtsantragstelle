import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { DescriptionField } from "../descriptionField";

export function fillAngelegenheit(
  descriptionField: DescriptionField,
  pdfFields: BeratungshilfePDF,
) {
  pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
    descriptionField.descriptions
      .map((x) => `${x.title} ${x.text} `)
      .join("\n");
}
