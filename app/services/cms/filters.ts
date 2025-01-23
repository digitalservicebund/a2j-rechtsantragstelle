import type { StrapiLocale } from "./models/StrapiLocale";
import type { ApiId } from "./schemas";

/**
 * See https://docs.strapi.io/dev-docs/api/rest/filters-locale-publication#filtering
 * for all available filter operations and add them here as necessary
 */
export type FilterOperation = "$eq" | "$in";

export type Filter = {
  field: string;
  value: string | string[];
  nestedField?: string;
  operation?: FilterOperation;
};

export type GetStrapiEntryOpts<T extends ApiId> = {
  apiId: T;
  filters?: Filter[];
  locale?: StrapiLocale;
  populate?: string;
  pageSize?: string;
  fields?: string;
  deep?: boolean;
};
