import { type AttachmentEntries, newPageHint } from "./attachment";

export type FillPdfFieldOrMoveToAttachment<TGeneratedPDFType> = {
  pdfFieldName: keyof TGeneratedPDFType;
  pdfFieldValue: string | undefined;
  pdfFieldMaxChars: number;
  attachmentTitle: string;
  pdfValues: TGeneratedPDFType;
  attachment: AttachmentEntries;
  attachmentPageHint?: string;
};

export function fillPdfFieldOrMoveToAttachment<TGeneratedPDFType>({
  pdfFieldName,
  pdfFieldValue,
  pdfFieldMaxChars,
  attachmentTitle,
  pdfValues,
  attachment,
  attachmentPageHint = newPageHint,
}: FillPdfFieldOrMoveToAttachment<TGeneratedPDFType>): {
  pdfValues: TGeneratedPDFType;
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
