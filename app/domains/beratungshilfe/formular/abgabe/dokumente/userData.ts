import { z } from "zod";
import {
  pdfFileUploadArrayOptionalSchema,
  pdfFileUploadArrayRequiredSchema,
} from "~/services/validation/pdfFileSchema";

export const dokumenteInputSchema = {
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
};

const _partialSchema = z.object(dokumenteInputSchema).partial();
export type DokumenteUserData = z.infer<typeof _partialSchema>;
