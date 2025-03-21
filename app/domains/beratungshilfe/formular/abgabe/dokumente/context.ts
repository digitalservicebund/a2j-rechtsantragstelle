import { z } from "zod";
import {
  pdfFileMetaDataSchema,
  fileUploadLimit,
  fileUploadErrorMap,
} from "~/util/file/pdfFileSchema";

export const dokumenteContext = {
  rechtsschutzversicherungBeweis: z
    .array(pdfFileMetaDataSchema)
    .nonempty()
    .max(fileUploadLimit, fileUploadErrorMap.fileLimitReached())
    .optional(), // remove after e2e tests have been added
};

const _contextObject = z.object(dokumenteContext).partial();
export type DokumenteContext = z.infer<typeof _contextObject>;
