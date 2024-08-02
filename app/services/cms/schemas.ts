import { StrapiCookieBannerSchema } from "./models/StrapiCookieBannerSchema";
import { StrapiFooterSchema } from "./models/StrapiFooter";
import { StrapiFormFlowPageSchema } from "./models/StrapiFormFlowPage";
import { StrapiPageSchema } from "./models/StrapiPage";
import { StrapiPageHeaderSchema } from "./models/StrapiPageHeader";
import { StrapiResultPageSchema } from "./models/StrapiResultPage";
import { StrapiTranslationSchema } from "./models/StrapiTranslations";
import { StrapiVorabCheckPageSchema } from "./models/StrapiVorabCheckPage";

export const entrySchemas = {
  "page-header": StrapiPageHeaderSchema,
  footer: StrapiFooterSchema,
  "cookie-banner": StrapiCookieBannerSchema,
} as const;
export type EntrySchemas = typeof entrySchemas;

export const flowPageSchemas = {
  "result-pages": StrapiResultPageSchema,
  "vorab-check-pages": StrapiVorabCheckPageSchema,
  "form-flow-pages": StrapiFormFlowPageSchema,
} as const;
export type FlowPage = typeof flowPageSchemas;

export const collectionSchemas = {
  pages: StrapiPageSchema,
  translations: StrapiTranslationSchema,
  ...flowPageSchemas,
} as const;
export type CollectionSchemas = typeof collectionSchemas;
