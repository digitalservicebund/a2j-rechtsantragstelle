import { z } from "zod";
import {
  pdfFileMetaDataSchema,
  fileUploadLimit,
} from "~/util/file/pdfFileSchema";

const fileUploadSchema = z
  .array(pdfFileMetaDataSchema)
  .nonempty({ message: "fileRequired" })
  .max(fileUploadLimit, { message: "fileLimitReached" })
  .optional(); // remove after e2e tests have been added

export const dokumenteContext = {
  arbeitslosengeldBeweis: fileUploadSchema,
  wohngeldBeweis: fileUploadSchema,
  bafoegBeweis: fileUploadSchema,

  krankengeldBeweis: fileUploadSchema,
  elterngeldBeweis: fileUploadSchema,
  buergergeldBeweis: fileUploadSchema,
  asylbewerberleistungenBeweis: fileUploadSchema,
  keineLeistungenBeweis: fileUploadSchema,
  grundsicherungBeweis: fileUploadSchema,

  lebensversicherungBeweis: fileUploadSchema,
  bausparvertragBeweis: fileUploadSchema,
  wertpapiereBeweis: fileUploadSchema,
  guthabenkontoBeweis: fileUploadSchema,
  sparkontoBeweis: fileUploadSchema,
  grundeigentumBeweis: fileUploadSchema,

  schwangerschaftAngabe: fileUploadSchema,
  schwerbehinderungBeweis: fileUploadSchema,
  medizinischeGruendeBeweis: fileUploadSchema,

  weitereAusgabenBeweis: fileUploadSchema,
};

const _contextObject = z
  .object(dokumenteContext)
  .partial();

export type DokumenteContext = z.infer<typeof _contextObject>;