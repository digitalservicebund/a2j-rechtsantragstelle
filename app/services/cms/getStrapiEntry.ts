import type { GetStrapiEntryOpts } from "./filters";
import { getStrapiEntryFromApi } from "./getStrapiEntryFromApi";
import { getStrapiEntryFromFile } from "./getStrapiEntryFromFile";
import { StrapiFileContent } from "./models/StrapiFileContent";
import { config } from "../env/env.server";

export type GetStrapiEntry = <T extends keyof StrapiFileContent>(
  opts: GetStrapiEntryOpts & { apiId: T },
) => Promise<StrapiFileContent[T]>;

export const getStrapiEntry: GetStrapiEntry =
  config().CMS === "FILE" ? getStrapiEntryFromFile : getStrapiEntryFromApi;
