import type { PDFForm } from "pdf-lib";
import type { BooleanField, StringField } from "./fileTypes";

const FONT_SIZE_DEFAULT = 10;

export function changeBooleanField(booleanField: BooleanField, form: PDFForm) {
  if (!booleanField.value) return;
  form.getCheckBox(booleanField.name).check();
}

export function changeStringField(stringField: StringField, form: PDFForm) {
  if (!stringField.value) return;
  const formField = form.getTextField(stringField.name);
  // maxLength property is overridden, because some fields have a max length of 2 even though the field width is greater
  formField.setMaxLength();
  formField.setText(stringField.value);
  // fontSize property is set to a default, because some fields have 0 for auto scale which is bad UX/UI
  formField.setFontSize(FONT_SIZE_DEFAULT);
}
