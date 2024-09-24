import fs from "fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument } from "pdf-lib";
import type { FlowId } from "~/flows/flowIds";
import { addDruckvermerk } from "./druckvermerk";
import {
  isBooleanField,
  type BooleanField,
  type StringField,
} from "./fileTypes";
import { changeBooleanField, changeStringField } from "./pdf.server";
import { pdfs } from "./pdfs";
import { resizeToA4 } from "./resizeToA4";
import { logError } from "../logging";

// Caching file read to survive server reload
// See https://remix.run/docs/en/1.16.1/tutorials/jokes#connect-to-the-database
declare global {
  // eslint-disable-next-line no-var, sonarjs/no-var
  var __pdfFileBuffers: Partial<Record<FlowId, Buffer>>; // NOSONAR
}

global.__pdfFileBuffers = Object.fromEntries(
  await Promise.all(
    pdfs.map(({ service, pdfFilename, flowId }) =>
      readRelativeFileToBuffer(
        path.join("data/pdf/", service, pdfFilename),
      ).then((pdfFileBuffer) => [flowId, pdfFileBuffer]),
    ),
  ),
);

async function readRelativeFileToBuffer(relativeFilepath: string) {
  try {
    return readFile(path.resolve(path.join(process.cwd(), relativeFilepath)));
  } catch (error) {
    logError({ error });
    return ArrayBuffer.prototype;
  }
}

const customFontBytes = fs.readFileSync(
  path.join(process.cwd(), "/data/pdf/fonts/BundesSansOffice-Regular.ttf"),
);

type FillPdfProps = {
  flowId: FlowId;
  pdfValues: Record<string, BooleanField | StringField>;
  yPositionsDruckvermerk?: number | number[];
  xPositionsDruckvermerk?: number;
};

export async function fillPdf({
  flowId,
  pdfValues,
  yPositionsDruckvermerk,
  xPositionsDruckvermerk,
}: FillPdfProps) {
  if (!(flowId in global.__pdfFileBuffers))
    throw Error("No pdf file found for " + flowId);

  const pdfDoc = await PDFDocument.load(global.__pdfFileBuffers[flowId]!);
  resizeToA4(pdfDoc);
  addDruckvermerk(pdfDoc, yPositionsDruckvermerk, xPositionsDruckvermerk);

  const form = pdfDoc.getForm();

  pdfDoc.registerFontkit(fontkit);
  const customFont = await pdfDoc.embedFont(customFontBytes);
  const rawUpdateFieldAppearances = form.updateFieldAppearances.bind(form);
  form.updateFieldAppearances = () => rawUpdateFieldAppearances(customFont);

  Object.values(pdfValues).forEach((value) => {
    if (isBooleanField(value)) {
      changeBooleanField(value, form);
    } else {
      changeStringField(value, form);
    }
  });

  return pdfDoc;
}
