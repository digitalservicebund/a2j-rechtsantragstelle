import { z } from "zod";
import { StrapiFooterSchema } from "./StrapiFooter";
import { StrapiPageSchema } from "./StrapiPage";
import { StrapiResultPageSchema } from "./StrapiResultPage";
import { StrapiVorabCheckCommonSchema } from "./StrapiVorabCheckCommon";
import { StrapiVorabCheckPageSchema } from "./StrapiVorabCheckPage";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiAmtsgerichtCommonSchema } from "./StrapiAmtsgerichtCommon";

export const StrapiFileContentSchema = z.object({
  "amtsgericht-common": z.array(
    HasStrapiIdSchema.extend({
      attributes: StrapiAmtsgerichtCommonSchema,
    }),
  ),
  footer: z.array(
    HasStrapiIdSchema.extend({
      attributes: StrapiFooterSchema,
    }),
  ),
  pages: z.array(
    HasStrapiIdSchema.extend({
      attributes: StrapiPageSchema,
    }),
  ),
  "result-pages": z.array(
    HasStrapiIdSchema.extend({
      attributes: StrapiResultPageSchema,
    }),
  ),
  "vorab-check-common": z.array(
    HasStrapiIdSchema.extend({
      attributes: StrapiVorabCheckCommonSchema,
    }),
  ),
  "vorab-check-pages": z.array(
    HasStrapiIdSchema.extend({
      attributes: StrapiVorabCheckPageSchema,
    }),
  ),
});

export type StrapiFileContent = z.infer<typeof StrapiFileContentSchema>;
export type SingleStrapiEntry =
  | StrapiFileContent["vorab-check-pages"][0]
  | StrapiFileContent["amtsgericht-common"][0]
  | StrapiFileContent["footer"][0]
  | StrapiFileContent["pages"][0]
  | StrapiFileContent["result-pages"][0]
  | StrapiFileContent["vorab-check-common"][0]
  | undefined;
