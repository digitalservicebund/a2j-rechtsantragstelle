import { z } from "zod";
import { type Filter } from "./filters";
import { StrapiCookieBannerSchema } from "./models/StrapiCookieBannerSchema";
import { StrapiFooterSchema } from "./models/StrapiFooter";
import { StrapiFormFlowPageSchema } from "./models/StrapiFormFlowPage";
import type { StrapiLocale } from "./models/StrapiLocale";
import { StrapiPageSchema } from "./models/StrapiPage";
import { StrapiPageHeaderSchema } from "./models/StrapiPageHeader";
import { StrapiResultPageSchema } from "./models/StrapiResultPage";
import { StrapiTranslationSchema } from "./models/StrapiTranslations";
import { StrapiVorabCheckPageSchema } from "./models/StrapiVorabCheckPage";

export const entrySchemas = {
  "page-header": z.array(StrapiPageHeaderSchema),
  footer: z.array(StrapiFooterSchema),
  "cookie-banner": z.array(StrapiCookieBannerSchema),
};
export type SingleEntryId = keyof typeof entrySchemas;
const _entrySchemas = z.object(entrySchemas);

export const flowPageSchemas = {
  "result-pages": z.array(StrapiResultPageSchema),
  "vorab-check-pages": z.array(StrapiVorabCheckPageSchema),
  "form-flow-pages": z.array(StrapiFormFlowPageSchema),
};

export type FlowPageId = keyof typeof flowPageSchemas;

export const collectionSchemas = {
  pages: z.array(StrapiPageSchema),
  translations: z.array(StrapiTranslationSchema),
  ...flowPageSchemas,
};

export type CollectionId = keyof typeof collectionSchemas;

export const strapiSchemas = {
  ...entrySchemas,
  ...collectionSchemas,
} as const;

export type ApiId = keyof typeof strapiSchemas;
export const strapiFileSchema = z.object(strapiSchemas);
export type StrapiSchemas = z.input<typeof strapiFileSchema>;
export type StrapiSchemasOutput = z.output<typeof strapiFileSchema>;

export type GetStrapiEntryOpts<T extends ApiId> = {
  apiId: T;
  filters?: Filter[];
  locale?: StrapiLocale;
  populate?: string;
  pageSize?: string;
  fields?: string;
  deep?: boolean;
};

export type GetStrapiEntry = <T extends ApiId>(
  opts: GetStrapiEntryOpts<T> & { apiId: T },
) => Promise<StrapiSchemas[T] | [null]>;
