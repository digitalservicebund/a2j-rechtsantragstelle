import { type PagesConfig } from "~/domains/pageSchemas";
import {
  pdfFileUploadArrayRequiredSchema,
  pdfFileUploadArrayOptionalSchema,
} from "~/services/validation/pdfFileSchema";

export const berHAntragDokumentePages = {
  dokumente: {
    stepId: "abgabe/dokumente",
    pageSchema: {
      arbeitslosengeldBeweis: pdfFileUploadArrayRequiredSchema,
      wohngeldBeweis: pdfFileUploadArrayRequiredSchema,
      bafoegBeweis: pdfFileUploadArrayRequiredSchema,
      krankengeldBeweis: pdfFileUploadArrayRequiredSchema,
      elterngeldBeweis: pdfFileUploadArrayRequiredSchema,
      buergergeldBeweis: pdfFileUploadArrayRequiredSchema,
      asylbewerberleistungenBeweis: pdfFileUploadArrayRequiredSchema,
      keineLeistungenBeweis: pdfFileUploadArrayRequiredSchema,
      grundsicherungBeweis: pdfFileUploadArrayRequiredSchema,
      lebensversicherungBeweis: pdfFileUploadArrayRequiredSchema,
      bausparvertragBeweis: pdfFileUploadArrayRequiredSchema,
      wertpapiereBeweis: pdfFileUploadArrayRequiredSchema,
      guthabenkontoBeweis: pdfFileUploadArrayRequiredSchema,
      sparkontoBeweis: pdfFileUploadArrayRequiredSchema,
      grundeigentumBeweis: pdfFileUploadArrayRequiredSchema,
      schwangerschaftAngabeBeweis: pdfFileUploadArrayRequiredSchema,
      schwerbehinderungBeweis: pdfFileUploadArrayRequiredSchema,
      medizinischeGruendeBeweis: pdfFileUploadArrayRequiredSchema,
      weitereAusgabenBeweis: pdfFileUploadArrayRequiredSchema,
      weitereDokumenteBeweis: pdfFileUploadArrayOptionalSchema,
    },
  },
} as const satisfies PagesConfig;
