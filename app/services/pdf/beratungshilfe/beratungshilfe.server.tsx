import { renderToStream } from "@react-pdf/renderer";
import type {
  BeratungshilfePDF,
  StringField,
  BooleanField,
} from "data/pdf/beratungshilfe/beratungshilfe.generated";
import { Convert } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import fs from "node:fs";
import path from "node:path";
import { PDFDocument, PDFTextField, PDFCheckBox } from "pdf-lib";
import {
  changeBooleanField,
  changeStringField,
  normalizePropertyName,
} from "../pdf.server";
import FormAttachment from "~/components/FormAttachment";

import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import fillHeader from "./sections/header";
import { fillVorraussetzungen } from "./sections/B_vorraussetzungen";
import { Attachment } from "./attachment";
import { fillAngelegenheit } from "./sections/A_angelegenheit";
import { fillEinkommen } from "./sections/C_einkommen";
import { fillUnterhalt } from "./sections/E_unterhalt";
import { fillBesitz } from "./sections/F_besitz";
import { fillFooter } from "./sections/footer";

export async function getBeratungshilfePdfFromContext(
  context: BeratungshilfeFormularContext,
) {
  const pdfFields = await getBeratungshilfeParameters();
  const attachment = new Attachment(context);

  if (!pdfFields) {
    throw new Error("No pdf fields or file found for beratungshilfe!");
  }

  fillHeader(attachment, context, pdfFields);
  fillAngelegenheit(attachment, pdfFields);
  fillVorraussetzungen(pdfFields, context);
  fillEinkommen(pdfFields, context);
  // fillWohnung
  fillUnterhalt(context, pdfFields);
  fillBesitz(pdfFields, context, attachment);

  fillFooter(pdfFields, context);

  return fillOutBeratungshilfe(
    pdfFields,
    attachment.descriptions,
    attachment.shouldCreateAttachment,
  );
}

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

async function handleOutOfLimitDescription(
  descriptions: { title: string; text: string }[],
  pdfDoc: PDFDocument,
) {
  const stream = await renderToStream(
    <FormAttachment descriptions={descriptions} />,
  );

  const PDFAttachmentAsBuffer: Buffer = await new Promise((resolve, reject) => {
    const buffers: Uint8Array[] = [];
    stream.on("data", (data: Uint8Array) => {
      buffers.push(data);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
    stream.on("error", reject);
  });

  const PDFAttachment = await PDFDocument.load(PDFAttachmentAsBuffer);
  const pages = PDFAttachment.getPages();

  for (let index = 0; index < pages.length; index++) {
    const [PDFAttachmentAsCopy] = await pdfDoc.copyPages(PDFAttachment, [
      index,
    ]);
    pdfDoc.insertPage(3 + index, PDFAttachmentAsCopy);
  }
  return pdfDoc.save();
}

async function fillOutBeratungshilfe(
  values: BeratungshilfePDF,
  descriptions: { title: string; text: string }[],
  shouldCreateNewPage: boolean,
) {
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

    if (shouldCreateNewPage) {
      return handleOutOfLimitDescription(descriptions, pdfDoc);
    }

    return pdfDoc.save();
  });
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
