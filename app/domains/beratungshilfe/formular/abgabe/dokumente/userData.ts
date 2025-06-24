import { z } from "zod";
import {
  pdfFileMetaDataSchema,
  fileUploadLimit,
} from "~/services/validation/pdfFileSchema";

const fileUploadRequiredSchema = z
  .array(pdfFileMetaDataSchema)
  .nonempty({ message: "fileRequired" })
  .max(fileUploadLimit, { message: "fileLimitReached" })
  .optional(); // Must remain despite being required, as the zod schema has no knowledge of which field is required

const fileUploadOptionalSchema = z
  .array(pdfFileMetaDataSchema)
  .max(fileUploadLimit, { message: "fileLimitReached" })
  .optional();

export const dokumenteInputSchema = {
  arbeitslosengeldBeweis: fileUploadRequiredSchema,
  wohngeldBeweis: fileUploadRequiredSchema,
  bafoegBeweis: fileUploadRequiredSchema,
  krankengeldBeweis: fileUploadRequiredSchema,
  elterngeldBeweis: fileUploadRequiredSchema,
  buergergeldBeweis: fileUploadRequiredSchema,
  asylbewerberleistungenBeweis: fileUploadRequiredSchema,
  keineLeistungenBeweis: fileUploadRequiredSchema,
  grundsicherungBeweis: fileUploadRequiredSchema,
  lebensversicherungBeweis: fileUploadRequiredSchema,
  bausparvertragBeweis: fileUploadRequiredSchema,
  wertpapiereBeweis: fileUploadRequiredSchema,
  guthabenkontoBeweis: fileUploadRequiredSchema,
  sparkontoBeweis: fileUploadRequiredSchema,
  grundeigentumBeweis: fileUploadRequiredSchema,
  schwangerschaftAngabeBeweis: fileUploadRequiredSchema,
  schwerbehinderungBeweis: fileUploadRequiredSchema,
  medizinischeGruendeBeweis: fileUploadRequiredSchema,
  weitereAusgabenBeweis: fileUploadRequiredSchema,
  weitereDokumenteBeweis: fileUploadOptionalSchema,
};

const _partialSchema = z.object(dokumenteInputSchema).partial();
export type DokumenteUserData = z.infer<typeof _partialSchema>;
