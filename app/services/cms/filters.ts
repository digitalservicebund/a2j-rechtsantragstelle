import type { StrapiFileContent } from "./models/StrapiFileContent";
import type { StrapiLocale } from "./models/StrapiLocale";

export type Filter = {
  field: string;
  value: string;
  nestedField?: string;
};

export type GetStrapiEntryOpts = {
  apiId: keyof StrapiFileContent;
  filters?: Filter[];
  locale?: StrapiLocale;
  populate?: string;
  pageSize?: string;
};
