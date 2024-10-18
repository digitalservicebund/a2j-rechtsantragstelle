import { type AttachmentEntries, newPageHint } from "./attachment";

export type FillPdfFieldOrMoveToAttachment<T> = {
  pdfFieldName: keyof T;
  pdfFieldValue: string | undefined;
  pdfFieldMaxChars: number;
  attachmentTitle: string;
  pdfValues: T;
  attachment: AttachmentEntries;
  attachmentPageHint?: string;
};

export function fillPdfFieldOrMoveToAttachment<T>({
  pdfFieldName,
  pdfFieldValue,
  pdfFieldMaxChars,
  attachmentTitle,
  pdfValues,
  attachment,
  attachmentPageHint = newPageHint,
}: FillPdfFieldOrMoveToAttachment<T>): {
  pdfValues: T;
  attachment: AttachmentEntries;
} {
  if (pdfFieldValue && pdfFieldValue.length > pdfFieldMaxChars) {
    (pdfValues[pdfFieldName] as { value: string }).value = attachmentPageHint;
    attachment.push({ title: attachmentTitle, text: pdfFieldValue });
    return { pdfValues, attachment };
  }
  (pdfValues[pdfFieldName] as { value: string }).value = pdfFieldValue ?? "";
  return { pdfValues, attachment };
}
