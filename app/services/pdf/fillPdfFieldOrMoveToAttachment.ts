import {
  SEE_IN_ATTACHMENT_DESCRIPTION,
  SEE_IN_ATTACHMENT_DESCRIPTION_SHORT,
  type AttachmentEntries,
} from "./attachment";
import type { BooleanField, StringField } from "./fileTypes";

const MIN_CHARACTERS_FOR_LONG_ATTACHMENT_DESCRIPTION = 10;

export function fillPdfFieldOrMoveToAttachment<
  T extends Record<string, StringField | BooleanField>,
>({
  pdfFieldName,
  pdfFieldValue,
  attachmentTitle,
  pdfValues,
  attachment,
}: {
  pdfFieldName: keyof T;
  pdfFieldValue: string | undefined;
  attachmentTitle: string;
  pdfValues: T;
  attachment: AttachmentEntries;
}): { pdfValues: T; attachment: AttachmentEntries } {
  const pdfField = pdfValues[pdfFieldName];
  const maxCharacters =
    "maxCharacters" in pdfField ? pdfField.maxCharacters : undefined;

  if (!pdfFieldValue || !maxCharacters) {
    return { pdfValues, attachment };
  }

  if (pdfFieldValue.length > maxCharacters) {
    pdfValues[pdfFieldName].value =
      maxCharacters > MIN_CHARACTERS_FOR_LONG_ATTACHMENT_DESCRIPTION
        ? SEE_IN_ATTACHMENT_DESCRIPTION
        : SEE_IN_ATTACHMENT_DESCRIPTION_SHORT;
    attachment.push({ title: attachmentTitle, text: pdfFieldValue });

    return { pdfValues, attachment };
  }

  pdfValues[pdfFieldName].value = pdfFieldValue ?? "";
  return { pdfValues, attachment };
}
