import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import type { AttachmentEntries } from "../attachment";

type PdfFillFunctionProps = {
  userdata: ProzesskostenhilfeFormularContext;
  pdfValues: ProzesskostenhilfePDF;
  attachment?: AttachmentEntries;
};
type PdfFillFunctionReturnProps = {
  pdfValues: ProzesskostenhilfePDF;
  attachment?: AttachmentEntries;
};

export type PdfFillFunction = (
  props: PdfFillFunctionProps,
) => PdfFillFunctionReturnProps;
