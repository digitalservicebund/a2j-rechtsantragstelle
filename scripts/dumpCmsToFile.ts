/* oxlint-disable no-console */
import fs from "node:fs";
import { configDotenv } from "dotenv";
import { getStrapiEntryFromApi } from "../app/services/cms/getStrapiEntryFromApi";
import { strapiSchemas, type ApiId } from "../app/services/cms/schemas";
import { config } from "../app/services/env/env.server";

const imageMatchRegex =
  /https:\/\/a2j-rechtsantragstelle-infra-public-assets-bucket.+?(.svg|.jpg|.png)+/g;

async function dumpCmsToFile() {
  configDotenv();
  const { CONTENT_FILE_PATH, STRAPI_API } = config();
  console.log(`Fetching CMS data from ${STRAPI_API}`);

  const locales = ["de", "sg"] as const;
  const content: Record<string, unknown> = {};

  for (const apiId of Object.keys(strapiSchemas) as ApiId[]) {
    const allEntries = [];
    process.stdout.write(`Fetching ${apiId}:`);
    for (const locale of locales) {
      const entries = await getStrapiEntryFromApi({
        apiId,
        locale,
        pageSize: "500",
        pLevel: 6,
      });
      if (entries.length > 0 && entries[0] !== null) {
        process.stdout.write(` ${locale} (${entries.length}) |`);
        allEntries.push(...entries);
      }
    }
    content[apiId] = allEntries;
    console.log();
  }

  // Fetch and embed images in base64
  const startFetch = Date.now();
  let stringifiedContent = JSON.stringify(content);
  const foundImageUrls = Array.from(
    stringifiedContent.matchAll(imageMatchRegex),
  ).map((match) => match[0]);
  const uniqueImageUrls = new Set(foundImageUrls);
  console.log(
    `Found ${foundImageUrls.length} image references (${uniqueImageUrls.size} unique), fetching from repository...`,
  );
  const responses = await Promise.all(
    Array.from(uniqueImageUrls).map((url) => fetch(url ?? "")),
  );
  const endFetch = Date.now();
  console.log(
    `Fetching ${uniqueImageUrls.size} images took approximately ${(endFetch - startFetch) / 1000}s`,
  );

  console.log("Embedding images in base64...");
  const startEmbed = Date.now();
  for (const response of responses.values()) {
    const imageData = await response.arrayBuffer();
    const base64Image = Buffer.from(imageData).toString("base64");
    stringifiedContent = stringifiedContent.replaceAll(
      response.url,
      `data:${response.headers.get("content-type")};base64,${base64Image}`,
    );
  }
  const endEmbed = Date.now();
  console.log(
    `Replaced ${foundImageUrls.length} instances, Duration: ${(endEmbed - startEmbed) / 1000}s`,
  );

  console.log(`Writing CMS content to ${CONTENT_FILE_PATH}...`);
  fs.writeFileSync(CONTENT_FILE_PATH, stringifiedContent + "\n", "utf8");
}

await dumpCmsToFile();
