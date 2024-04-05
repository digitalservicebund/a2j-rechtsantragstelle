import type { PDFForm } from "pdf-lib";
import { PDFCheckBox, PDFTextField } from "pdf-lib";

import type {
  BooleanField,
  StringField,
} from "data/pdf/beratungshilfe/beratungshilfe.generated";
import { getFontSizeFieldValue } from "./getFontSizeFieldValue";

const umlautMap = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  Ä: "Ae",
  Ö: "Oe",
  Ü: "Ue",
  ß: "ss",
} as const;

export function normalizePropertyName(propertyName: string) {
  return propertyName
    .replace(
      /[äöüÄÖÜß]/g,
      (match) => umlautMap[match as keyof typeof umlautMap],
    )
    .replace(/[^a-zA-Z0-9]/g, "");
}

export function changeBooleanField(booleanField: BooleanField, form: PDFForm) {
  if (!booleanField.value) return;
  const formField = form.getField(booleanField.name);
  if (formField instanceof PDFCheckBox) {
    formField.check();
  }
}

export function changeStringField(stringField: StringField, form: PDFForm) {
  if (!stringField.value) return;
  const formField = form.getField(stringField.name);
  if (formField instanceof PDFTextField) {
    // We override the restriction of a field where it is set to have max length of 2.
    // This is because it impacts letter spacing e.g in the fourth column of "G_ausgaben".
    formField.setMaxLength(undefined);
    formField.setText(stringField.value);
    const fontSize = getFontSizeFieldValue(stringField.name);
    formField.setFontSize(fontSize);
  }
}
