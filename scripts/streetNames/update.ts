// oxlint-disable no-console
import fs from "node:fs";
import path from "node:path";
import { buildStreetNamesDb } from "./postProcess";

const FILE_NAME = "streets.updated.csv";
const RAW_URL_REMOTE = `https://raw.githubusercontent.com/openpotato/openplzapi.data/main/src/de/osm/${FILE_NAME}`;
const LOCAL_PATH = ".";

const localFilePath = path.join(__dirname, LOCAL_PATH, FILE_NAME);
const etagFilePath = `${localFilePath}.etag`;

async function syncStreetNamesFile() {
  try {
    let validETag: string | null = null;
    try {
      const rawETag = fs.readFileSync(etagFilePath, "utf8"); // Throws error if not existing
      if (/^(W\/)?"[a-zA-Z0-9]+"$/.test(rawETag) && rawETag.length < 100) {
        validETag = rawETag;
      }
    } catch {
      console.warn("No valid existing ETag found.");
    }

    const headers: Record<string, string> = validETag
      ? { "If-None-Match": validETag }
      : {};

    console.log(`Fetching ${RAW_URL_REMOTE}`);
    const response = await fetch(RAW_URL_REMOTE, { headers });

    // If the Etag matches the remote, it returns a '304 Not Modified'
    if (response.status === 304) {
      console.log("✅ Local ETag matches remote, skipping download.");
      return;
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch raw file: ${response.status} ${response.statusText}`,
      );
    }

    console.log("Remote file is new or updated. Downloading...");
    fs.writeFileSync(localFilePath, Buffer.from(await response.arrayBuffer()));

    const newETag = response.headers.get("etag");
    if (newETag) {
      fs.writeFileSync(etagFilePath, newETag);
      console.log(`Saved new ETag ${newETag}.`);
    }

    buildStreetNamesDb();

    console.log("✅ Download complete and local file updated.");
  } catch (error) {
    console.error("❌ An error occurred:", error);
  }
}

syncStreetNamesFile();
