import type { StrapiLocale } from "./models/StrapiLocale";
import type { ApiId } from "./schemas";

export type Filter = {
  field: string;
  value: string;
  nestedField?: string;
};

export type GetStrapiEntryOpts = {
  apiId: ApiId;
  filters?: Filter[];
  locale?: StrapiLocale;
  populate?: string;
  pageSize?: string;
  fields?: string;
  deep?: boolean;
};
