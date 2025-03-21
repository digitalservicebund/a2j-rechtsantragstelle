import { z } from "zod";
import {
  pdfFileMetaDataSchema,
  fileUploadLimit,
  fileUploadErrorMap,
} from "~/util/file/pdfFileSchema";

const fileUploadSchema = z
  .array(pdfFileMetaDataSchema)
  .nonempty()
  .max(fileUploadLimit, fileUploadErrorMap.fileLimitReached())
  .optional(); // remove after e2e tests have been added

export const dokumenteContext = {
  rechtsschutzversicherungBeweis: fileUploadSchema,
  buergergeldBeweis: fileUploadSchema,
  wertpapierBeweis: fileUploadSchema,
};

const _contextObject = z.object(dokumenteContext).partial();
export type DokumenteContext = z.infer<typeof _contextObject>;
