import { renderToStream } from "@react-pdf/renderer";
import { isBooleanField, isStringField } from "../fileTypes";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { changeBooleanField, changeStringField } from "../pdf.server";
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
import { getBeratungshilfeParameters } from "data/pdf/beratungshilfe/beratungshilfe.generated";

export async function getBeratungshilfePdfFromContext(
  context: BeratungshilfeFormularContext,
) {
  const pdfFields = getBeratungshilfeParameters();
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
  addDruckvermerk(PDFAttachment);
  const pages = PDFAttachment.getPages();

  for (let index = 0; index < pages.length; index++) {
    const [PDFAttachmentAsCopy] = await pdfDoc.copyPages(PDFAttachment, [
      index,
    ]);
    pdfDoc.insertPage(3 + index, PDFAttachmentAsCopy);
  }
}

async function fillOutBeratungshilfe(
  values: BeratungshilfePDF,
  attachment: Attachment,
) {
  const pdfDoc = await PDFDocument.load(await getBeratungshilfePdfBuffer());
  const yPositionsDruckvermerk = [90, 108, 138];
  resizeToA4(pdfDoc);
  addDruckvermerk(pdfDoc, yPositionsDruckvermerk);

  const form = pdfDoc.getForm();

  Object.values(values).forEach((value) => {
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
