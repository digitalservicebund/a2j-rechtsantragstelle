import type { GetStrapiEntryOpts } from "./filters";
import { getStrapiEntryFromApi } from "./getStrapiEntryFromApi";
import { getStrapiEntryFromFile } from "./getStrapiEntryFromFile";
import type { ApiId, StrapiSchemas } from "./schemas";
import { config } from "../env/env.server";

export type GetStrapiEntry = <T extends ApiId>(
  opts: GetStrapiEntryOpts & { apiId: T },
) => Promise<StrapiSchemas[T] | [null]>;

export const getStrapiEntry: GetStrapiEntry =
  config().CMS === "FILE" ? getStrapiEntryFromFile : getStrapiEntryFromApi;
