import { renderToBuffer } from "@react-pdf/renderer";
import { PDFDocument } from "pdf-lib";
import type { AttachmentProps } from "./FormAttachment";
import FormAttachment from "./FormAttachment";
import { addDruckvermerk } from "../druckvermerk";

export async function renderAnhang(attachmentProps: AttachmentProps) {
  const attachmentPdf = await PDFDocument.load(
    await renderToBuffer(<FormAttachment {...attachmentProps} />),
  );
  addDruckvermerk(attachmentPdf);
  return attachmentPdf;
}
