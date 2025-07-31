import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { type PdfFillFunction } from "~/services/pdf/fillOutFunction";

export type BerHPdfFillFunction = PdfFillFunction<
  BeratungshilfeFormularUserData,
  BeratungshilfePDF
>;
