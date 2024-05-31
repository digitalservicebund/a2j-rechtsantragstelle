import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiAmtsgerichtCommonSchema } from "./StrapiAmtsgerichtCommon";
import { StrapiCookieBannerSchema } from "./StrapiCookieBannerSchema";
import { StrapiFooterSchema } from "./StrapiFooter";
import { StrapiFormFlowPageSchema } from "./StrapiFormFlowPage";
import { StrapiGlobalSchema } from "./StrapiGlobal";
import { StrapiPageSchema } from "./StrapiPage";
import { StrapiPageHeaderSchema } from "./StrapiPageHeader";
import { StrapiResultPageSchema } from "./StrapiResultPage";
import { StrapiTranslationSchema } from "./StrapiTranslations";
import { StrapiVorabCheckCommonSchema } from "./StrapiVorabCheckCommon";
import { StrapiVorabCheckPageSchema } from "./StrapiVorabCheckPage";

export const StrapiFileContentSchema = z.object({
  "amtsgericht-common": z.array(
    HasStrapiIdSchema.extend({
      attributes: StrapiAmtsgerichtCommonSchema,
    }),
  ),
  "page-header": z.array(
    HasStrapiIdSchema.extend({
      attributes: StrapiPageHeaderSchema,
    }),
  ),
  global: z.array(
    HasStrapiIdSchema.extend({
      attributes: StrapiGlobalSchema,
    }),
  ),
  footer: z.array(
    HasStrapiIdSchema.extend({
      attributes: StrapiFooterSchema,
    }),
  ),
  "cookie-banner": z.array(
    HasStrapiIdSchema.extend({
      attributes: StrapiCookieBannerSchema,
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
  "form-flow-pages": z.array(
    HasStrapiIdSchema.extend({
      attributes: StrapiFormFlowPageSchema,
    }),
  ),
  translations: z.array(
    HasStrapiIdSchema.extend({
      attributes: StrapiTranslationSchema,
    }),
  ),
});

export type StrapiFileContent = z.infer<typeof StrapiFileContentSchema>;
