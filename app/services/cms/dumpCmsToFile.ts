/* eslint-disable no-console */
import fs from "node:fs";
import { configDotenv } from "dotenv";
import { getStrapiEntryFromApi } from "./getStrapiEntryFromApi";
import { strapiSchemas, type ApiId } from "./schemas";
import { config } from "../env/env.server";

async function dumpCmsToFile() {
  configDotenv();
  const { CONTENT_FILE_PATH, STRAPI_API } = config();
  console.log(`Fetching CMS data from ${STRAPI_API}`);

  const locale = "all";
  const content: Record<string, unknown> = {};

  for (const apiId of Object.keys(strapiSchemas) as ApiId[]) {
    console.log(`Fetching ${apiId}`);
    content[apiId] = await getStrapiEntryFromApi({
      apiId,
      locale,
      pageSize: "500",
    });
  }

  console.log(`Writing CMS content to ${CONTENT_FILE_PATH}...`);
  fs.writeFileSync(CONTENT_FILE_PATH, JSON.stringify(content) + "\n", "utf8");
}

if (process.argv[2] === "dumpCmsToFile") await dumpCmsToFile();
