import type { PDFForm } from "pdf-lib";
import type { BooleanField, StringField } from "./fileTypes";
import { getFontSizeFieldValue } from "./getFontSizeFieldValue";

export function changeBooleanField(booleanField: BooleanField, form: PDFForm) {
  if (!booleanField.value) return;
  form.getCheckBox(booleanField.name).check();
}

export function changeStringField(stringField: StringField, form: PDFForm) {
  if (!stringField.value) return;
  const formField = form.getTextField(stringField.name);
  // We override the restriction of a field where it is set to have max length of 2.
  // This is because it impacts letter spacing e.g. in the fourth column of "G_ausgaben".
  formField.setMaxLength(undefined);
  formField.setText(stringField.value);
  const fontSize = getFontSizeFieldValue(stringField.name);
  formField.setFontSize(fontSize);
}
