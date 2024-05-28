import { renderToBuffer } from "@react-pdf/renderer";
import type {
  BeratungshilfePDF,
  StringField,
  BooleanField,
} from "data/pdf/beratungshilfe/beratungshilfe.generated";
import { Convert } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import { readFile } from "node:fs/promises";
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
import type { Attachment } from "./attachment";
import { createAttachment } from "./attachment";
import { fillAngelegenheit } from "./sections/A_angelegenheit";
import { fillEinkommen } from "./sections/C_einkommen";
import { fillUnterhalt } from "./sections/E_unterhalt/E_unterhalt";
import { fillBesitz } from "./sections/F_besitz/F_besitz";
import { fillFooter } from "./sections/footer";
import { fillWohnen } from "./sections/D_wohnen";
import { fillAusgaben } from "./sections/G_ausgaben";
import { resizeToA4 } from "./resizeToA4";
import { addDruckvermerk } from "./druckvermerk";

export async function getBeratungshilfePdfFromContext(
  context: BeratungshilfeFormularContext,
) {
  const pdfFields = await getBeratungshilfeParameters();
  if (!pdfFields) {
    throw new Error("No pdf fields or file found for beratungshilfe!");
  }

  const attachmentContent = createAttachment(context);

  fillHeader(attachmentContent, pdfFields, context);
  fillAngelegenheit(attachmentContent, pdfFields, context);
  fillVorraussetzungen(pdfFields, context);
  fillEinkommen(pdfFields, context);
  fillUnterhalt(attachmentContent, pdfFields, context);
  fillBesitz(attachmentContent, pdfFields, context);
  fillAusgaben(attachmentContent, pdfFields, context);
  fillWohnen(pdfFields, context);
  fillFooter(pdfFields, context);

  return fillOutBeratungshilfe(pdfFields, attachmentContent);
}

export async function getBeratungshilfeParameters() {
  const json: Record<string, StringField | BooleanField> = {};
  const fields = (await getBeratungshilfePdf()).getForm().getFields();
  fields.forEach((field) => {
    const name = field.getName();
    const fieldName = normalizePropertyName(name);
    const value =
      field instanceof PDFTextField
        ? field.getText()
        : field instanceof PDFCheckBox
          ? field.isChecked()
          : undefined;
    json[fieldName] = { name, value };
  });
  return Convert.toBeratungshilfePDF(JSON.stringify(json));
}

async function handleOutOfLimitDescription(
  descriptions: { title: string; text: string }[],
  pdfDoc: PDFDocument,
) {
  const attachementPdf = await PDFDocument.load(
    await renderToBuffer(<FormAttachment descriptions={descriptions} />),
  );
  addDruckvermerk(attachementPdf);

  for (let index = 0; index < attachementPdf.getPageCount(); index++) {
    const [attachementPage] = await pdfDoc.copyPages(attachementPdf, [index]);
    pdfDoc.addPage(attachementPage);
  }
}

type PdfField = BeratungshilfePDF[keyof BeratungshilfePDF];

function isBooleanField(field: PdfField): field is BooleanField {
  return typeof field.value === "boolean";
}

function isStringField(field: PdfField): field is StringField {
  return typeof field.value === "string";
}

async function fillOutBeratungshilfe(
  values: BeratungshilfePDF,
  attachment: Attachment,
) {
  const pdfDoc = await getBeratungshilfePdf();
  const yPositionsDruckvermerk = [90, 108, 138];
  resizeToA4(pdfDoc);
  addDruckvermerk(pdfDoc, yPositionsDruckvermerk);

  const form = pdfDoc.getForm();

  Object.values(values).forEach((value: PdfField) => {
    if (isBooleanField(value)) {
      changeBooleanField(value, form);
    } else if (isStringField(value)) {
      changeStringField(value, form);
    }
  });

  if (attachment.shouldCreateAttachment) {
    await handleOutOfLimitDescription(attachment.descriptions, pdfDoc);
  }

  return pdfDoc;
}

// Caching file read, decryption & parsing to survive server reload
// See https://remix.run/docs/en/1.16.1/tutorials/jokes#connect-to-the-database
declare global {
  // eslint-disable-next-line no-var
  var __beratungshilfePdf: Buffer | undefined; // NOSONAR
}

// Singleton to prevent multiple file reads
async function getBeratungshilfePdfBuffer() {
  if (!global.__beratungshilfePdf) {
    const relFilepath =
      "data/pdf/beratungshilfe/Antrag_auf_Bewilligung_von_Beratungshilfe.pdf";
    const filepath = path.resolve(path.join(process.cwd(), relFilepath));
    try {
      const fileBuffer = await readFile(filepath);
      global.__beratungshilfePdf = fileBuffer;
    } catch (error) {
      console.error(error);
    }
  }

  return global.__beratungshilfePdf ?? ArrayBuffer.prototype;
}

async function getBeratungshilfePdf() {
  return PDFDocument.load(await getBeratungshilfePdfBuffer());
}
