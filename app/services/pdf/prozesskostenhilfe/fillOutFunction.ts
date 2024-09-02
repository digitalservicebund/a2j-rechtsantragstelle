import type { AttachmentEntries } from "../attachment";

export type PdfFillFunctionProps<ContextType, PDFType> = {
  userData: ContextType;
  pdfValues: PDFType;
  attachment?: AttachmentEntries;
};
export type PdfFillFunctionReturnProps<ContextType, PDFType> = Pick<
  PdfFillFunctionProps<ContextType, PDFType>,
  "pdfValues" | "attachment"
>;

export type PdfFillFunction<ContextType, PDFType> = (
  props: PdfFillFunctionProps<ContextType, PDFType>,
) => PdfFillFunctionReturnProps<ContextType, PDFType>;

type PdfFillReducerProps<ContextType, PDFType> = {
  userData: ContextType;
  pdfParams: PDFType;
  fillFunctions: PdfFillFunction<ContextType, PDFType>[];
};

/**
 * One function to fill them all.
 * Takes all pdf parameters, userdata, and functions to fill out the pdf, and uses Array.reduce to return the filled pdf and attachment
 * @param userData: User-entered data
 * @param pdfParams: Unfilled, initial pdf parameters
 * @param fillFunctions: Sequence of functions to fill out the PDF
 * @returns Object containing the filled pdf and attachment
 */
export function pdfFillReducer<ContextType, PDFType>({
  userData,
  pdfParams,
  fillFunctions,
}: PdfFillReducerProps<ContextType, PDFType>) {
  return fillFunctions.reduce(
    ({ pdfValues, attachment }, fillFunction) => {
      const { pdfValues: newValues, attachment: newAttachment } = fillFunction({
        pdfValues,
        userData,
        attachment,
      });
      return {
        pdfValues: { ...pdfValues, ...newValues },
        attachment: [...attachment, ...(newAttachment ?? [])],
      };
    },
    { pdfValues: pdfParams, attachment: [] as AttachmentEntries },
  );
}
