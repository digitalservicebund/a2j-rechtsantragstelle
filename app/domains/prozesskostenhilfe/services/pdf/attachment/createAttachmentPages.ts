import type PDFDocument from "pdfkit";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import type { AttachmentEntries } from "~/services/pdf/attachment";
import { createAttachmentEntries } from "~/services/pdf/attachment/createAttachmentEntries";
import { createHeader } from "~/services/pdf/header/createHeader";

type AttachmentPage<
  TContext extends
    | BeratungshilfeFormularContext
    | ProzesskostenhilfeFormularContext,
> = (params: {
  doc: typeof PDFDocument;
  documentStruct: PDFKit.PDFStructureElement;
  userData: TContext;
  attachment: AttachmentEntries | undefined;
  headerText: string;
}) => void;

export const createAttachmentPages: AttachmentPage<
  BeratungshilfeFormularContext
> = ({ doc, documentStruct, userData, attachment, headerText }) => {
  createHeader(doc, documentStruct, userData, headerText);
  doc.moveDown(2);

  const attachmentPagesStruct = doc.struct("Sect");
  doc.moveDown(1);

  createAttachmentEntries(doc, attachmentPagesStruct, attachment);

  documentStruct.add(attachmentPagesStruct);
};
