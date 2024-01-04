import fs from "node:fs";
import { getStrapiCollectionFromApi } from "./getStrapiEntryFromApi";
import type { EntrySchemas, CollectionSchemas } from "./schemas";
import { entrySchemas, collectionSchemas } from "./schemas";
import { config } from "../env/env.server";
import { configDotenv } from "dotenv";

async function dumpCmsToFile() {
  configDotenv();
  const { CONTENT_FILE_PATH, STRAPI_API } = config();
  console.log(`Fetching CMS data from ${STRAPI_API}`);

  const locale = "all";
  const apiIds = Object.keys(entrySchemas).concat(
    Object.keys(collectionSchemas),
  ) as (keyof EntrySchemas | keyof CollectionSchemas)[];

  const content: Record<string, any> = {};
  for (const apiId of apiIds) {
    console.log(`Fetching ${apiId}`);
    content[apiId] = await getStrapiCollectionFromApi({
      apiId,
      locale,
      pageSize: "500",
    });
  }

  console.log(`Writing CMS content to ${CONTENT_FILE_PATH}...`);
  fs.writeFileSync(CONTENT_FILE_PATH, JSON.stringify(content) + "\n", "utf8");
}

if (process.argv[2] === "dumpCmsToFile") void dumpCmsToFile();
