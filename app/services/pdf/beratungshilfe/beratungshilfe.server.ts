import type {
  BeratungshilfePDF,
  StringField,
  BooleanField,
} from "./beratungshilfe.generated";
import { Convert } from "./beratungshilfe.generated";
import fs from "node:fs";
import path from "node:path";
import type { PDFForm } from "pdf-lib";
import { PDFDocument, PDFTextField, PDFCheckBox } from "pdf-lib";
import { normalizePropertyName } from "../pdf.server";

export async function getBeratungshilfeParameters() {
  const json: { [key: string]: StringField | BooleanField } = {};
  await PDFDocument.load(getBeratungshilfePdfBuffer()).then((pdfDoc) => {
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    fields.forEach((field) => {
      const fieldName = normalizePropertyName(field.getName());

      const textField = field as PDFTextField;
      if (field instanceof PDFTextField) {
        json[fieldName] = {
          name: field.getName(),
          value: textField.getText(),
        } as StringField;
      }

      const booleanField = field as PDFCheckBox;
      if (field instanceof PDFCheckBox) {
        json[fieldName] = {
          name: field.getName(),
          value: booleanField.isChecked(),
        } as BooleanField;
      }
    });
  });

  return Convert.toBeratungshilfePDF(JSON.stringify(json));
}

export async function fillOutBeratungshilfe(values: BeratungshilfePDF) {
  return await PDFDocument.load(getBeratungshilfePdfBuffer()).then((pdfDoc) => {
    const form = pdfDoc.getForm();

    Object.entries(values).forEach(([, value]) => {
      // When value is a BooleanField
      const booleanField = value as BooleanField;
      if (!changeBooleanField(booleanField, form)) {
        // When value is a StringField
        const stringField = value as StringField;
        changeStringField(stringField, form);
      }
    });

    return pdfDoc.save();
  });
}

function changeBooleanField(field: BooleanField, form: PDFForm) {
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

function changeStringField(field: StringField, form: PDFForm) {
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

// Caching file read, decryption & parsing to survive server reload
// See https://remix.run/docs/en/1.16.1/tutorials/jokes#connect-to-the-database
declare global {
  // eslint-disable-next-line no-var
  var __beratungshilfeBuffer: ArrayBuffer | undefined; // NOSONAR
}

// Singleton to prevent multiple file reads
function getBeratungshilfePdfBuffer(): ArrayBuffer {
  if (!global.__beratungshilfeBuffer) {
    try {
      const file = path.resolve(
        path.join(
          process.cwd(),
          "app/services/pdf/beratungshilfe/Antrag_auf_Bewilligung_von_Beratungshilfe.pdf",
        ),
      );
      global.__beratungshilfeBuffer = fs.readFileSync(file);
    } catch (error) {
      console.error(error);
      return ArrayBuffer.prototype;
    }
  }

  return global.__beratungshilfeBuffer ?? ArrayBuffer.prototype;
}
