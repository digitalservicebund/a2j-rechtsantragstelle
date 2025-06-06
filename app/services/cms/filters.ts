/**
 * See https://docs.strapi.io/dev-docs/api/rest/filters-locale-publication#filtering
 * for all available filter operations and add them here as necessary
 */
type FilterOperation = "$eq" | "$in";

export type Filter = {
  field: string;
  value: string | string[];
  nestedField?: string;
  operation?: FilterOperation;
};
