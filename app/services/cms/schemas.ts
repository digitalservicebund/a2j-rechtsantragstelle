import { StrapiFooterSchema } from "./models/StrapiFooter";
import { StrapiPageSchema } from "./models/StrapiPage";
import { StrapiResultPageSchema } from "./models/StrapiResultPage";
import { StrapiVorabCheckCommonSchema } from "./models/StrapiVorabCheckCommon";
import { StrapiVorabCheckPageSchema } from "./models/StrapiVorabCheckPage";
import { StrapiAmtsgerichtCommonSchema } from "./models/StrapiAmtsgerichtCommon";
import { StrapiCookieBannerSchema } from "./models/StrapiCookieBannerSchema";
import { StrapiPageHeaderSchema } from "./models/StrapiPageHeader";
import { StrapiGlobalSchema } from "./models/StrapiGlobal";

export const entrySchemas = {
  "page-header": StrapiPageHeaderSchema,
  global: StrapiGlobalSchema,
  footer: StrapiFooterSchema,
  "vorab-check-common": StrapiVorabCheckCommonSchema,
  "amtsgericht-common": StrapiAmtsgerichtCommonSchema,
  "cookie-banner": StrapiCookieBannerSchema,
} as const;
export type EntrySchemas = typeof entrySchemas;

export const collectionSchemas = {
  pages: StrapiPageSchema,
  "result-pages": StrapiResultPageSchema,
  "vorab-check-pages": StrapiVorabCheckPageSchema,
} as const;
export type CollectionSchemas = typeof collectionSchemas;
