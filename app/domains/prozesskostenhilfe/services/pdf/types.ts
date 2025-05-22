import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { type PdfFillFunction } from "~/services/pdf/fillOutFunction";

export type PkhPdfFillFunction = PdfFillFunction<
  ProzesskostenhilfeFormularUserData,
  ProzesskostenhilfePDF
>;
