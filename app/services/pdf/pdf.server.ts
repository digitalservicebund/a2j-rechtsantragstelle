import type { PDFForm } from "pdf-lib";
import { PDFCheckBox, PDFTextField } from "pdf-lib";

import type {
  BooleanField,
  StringField,
} from "data/pdf/beratungshilfe/beratungshilfe.generated";

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

export function changeBooleanField(field: BooleanField, form: PDFForm) {
  // When value is a BooleanField
  const booleanField = field;
  if (booleanField) {
    const field = form.getField(booleanField.name ?? "");
    if (field instanceof PDFCheckBox) {
      const checkBox = field;
      checkBox.uncheck();
      if (booleanField.value) {
        checkBox.check();
      }
      return true;
    }
  }
  return false;
}

export function changeStringField(field: StringField, form: PDFForm) {
  const stringField = field;
  if (stringField) {
    const field = form.getField(stringField.name ?? "");
    if (field instanceof PDFTextField) {
      const textField = field;
      if (textField) {
        textField.setText(stringField.value);
        textField.setFontSize(10);
        return true;
      }
    }
  }
  return false;
}
