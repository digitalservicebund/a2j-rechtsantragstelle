import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { type PdfFillFunction } from "~/services/pdf/fillOutFunction";

export type PkhPdfFillFunction = PdfFillFunction<
  ProzesskostenhilfeFormularContext,
  ProzesskostenhilfePDF
>;
