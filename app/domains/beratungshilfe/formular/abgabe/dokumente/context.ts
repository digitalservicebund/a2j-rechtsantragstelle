import { z } from "zod";
import {
  pdfFileMetaDataSchema,
  fileUploadLimit,
} from "~/util/file/pdfFileSchema";

const fileUploadRequiredSchema = z
  .array(pdfFileMetaDataSchema)
  .nonempty({ message: "fileRequired" })
  .max(fileUploadLimit, { message: "fileLimitReached" })
  .optional(); // remove after e2e tests have been added

const fileUploadOptionalSchema = z
  .array(pdfFileMetaDataSchema)
  .max(fileUploadLimit, { message: "fileLimitReached" })
  .optional(); // remove after e2e tests have been added

export const dokumenteContext = {
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

const _contextObject = z.object(dokumenteContext).partial();

export type DokumenteContext = z.infer<typeof _contextObject>;
