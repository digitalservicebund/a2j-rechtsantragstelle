import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import type { PDFFont } from "pdf-lib";
import { PDFDocument } from "pdf-lib";
import type { FlowId } from "~/domains/flowIds";
import { addDruckvermerk } from "./druckvermerk";
import { isBooleanField, type PdfValues } from "./fileTypes";
import { changeBooleanField, changeStringField } from "./pdf.server";
import { pdfs } from "./pdfs";
import { readRelativeFileToBuffer } from "./readRelativeFileToBuffer";
import { resizeToA4 } from "./resizeToA4";

// Caching file read to survive server reload
// See https://remix.run/docs/en/1.16.1/tutorials/jokes#connect-to-the-database
declare global {
  // eslint-disable-next-line no-var
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

const bundesSansCondensed = await readRelativeFileToBuffer(
  "/data/pdf/fonts/BundesSansCond-DTP-Regular.otf",
);

export let customPdfFormFont: PDFFont;

type FillPdfProps = {
  flowId: FlowId;
  pdfValues: PdfValues;
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
  pdfDoc.registerFontkit(fontkit);
  customPdfFormFont = await pdfDoc.embedFont(bundesSansCondensed, {
    features: {
      liga: false,
    },
  });
  addDruckvermerk(pdfDoc, yPositionsDruckvermerk, xPositionsDruckvermerk);

  const form = pdfDoc.getForm();

  const rawUpdateFieldAppearances = form.updateFieldAppearances.bind(form);
  form.updateFieldAppearances = () =>
    rawUpdateFieldAppearances(customPdfFormFont);

  Object.values(pdfValues).forEach((value) => {
    if (isBooleanField(value)) {
      changeBooleanField(value, form);
    } else {
      changeStringField(value, form);
    }
  });

  return pdfDoc;
}
