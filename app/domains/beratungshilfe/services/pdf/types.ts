import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { type PdfFillFunction } from "~/services/pdf/fillOutFunction";

export type BerHPdfFillFunction = PdfFillFunction<
  BeratungshilfeFormularContext,
  BeratungshilfePDF
>;
