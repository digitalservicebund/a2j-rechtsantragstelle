import {
  SEE_IN_ATTACHMENT_DESCRIPTION,
  SEE_IN_ATTACHMENT_DESCRIPTION_SHORT,
  type AttachmentEntries,
} from "./attachment";
import { isBooleanField, type PdfValues } from "./fileTypes";

export function fillPdfField<T extends PdfValues>({
  fieldname,
  value,
  attachmentTitle,
  pdfValues,
  attachment,
}: {
  fieldname: keyof T;
  value?: string;
  attachmentTitle: string;
  pdfValues: T;
  attachment: AttachmentEntries;
}): { pdfValues: T; attachment: AttachmentEntries } {
  if (!value) return { pdfValues, attachment };

  pdfValues[fieldname].value = value;

  if (!isBooleanField(pdfValues[fieldname])) {
    const { maxCharacters } = pdfValues[fieldname];

    if (value.length > maxCharacters) {
      attachment.push({ title: attachmentTitle, text: value });
      pdfValues[fieldname].value =
        maxCharacters >= SEE_IN_ATTACHMENT_DESCRIPTION.length
          ? SEE_IN_ATTACHMENT_DESCRIPTION
          : SEE_IN_ATTACHMENT_DESCRIPTION_SHORT;
    }
  }

  return { pdfValues, attachment };
}
