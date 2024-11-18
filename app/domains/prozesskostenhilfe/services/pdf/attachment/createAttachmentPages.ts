import type PDFDocument from "pdfkit";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { createAttachmentEntries } from "~/domains/prozesskostenhilfe/services/pdf/attachment/createAttachmentEntries";
import type { AttachmentEntries } from "~/services/pdf/attachment";
import { createHeading } from "~/services/pdf/createHeading";
import { createHeader } from "~/services/pdf/header/createHeader";

export const createAttachmentPages = <
  TContext extends
    | BeratungshilfeFormularContext
    | ProzesskostenhilfeFormularContext,
>({
  doc,
  documentStruct,
  userData,
  attachment,
  headerText,
}: {
  doc: typeof PDFDocument;
  documentStruct: PDFKit.PDFStructureElement;
  userData: TContext;
  attachment: AttachmentEntries | undefined;
  headerText: string;
}) => {
  createHeader(doc, documentStruct, userData, headerText);

  const attachmentPagesStruct = doc.struct("Sect");
  createHeading(doc, attachmentPagesStruct, "Anhang", "H1");

  createAttachmentEntries(doc, attachmentPagesStruct, attachment);

  documentStruct.add(attachmentPagesStruct);
};
