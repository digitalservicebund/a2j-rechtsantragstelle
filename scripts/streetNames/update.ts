// oxlint-disable no-console
import fs from "node:fs";
import path from "node:path";
import { generateStreetNamesJson } from "./postProcess";

const FILE_NAME = "streets.updated.csv";
const RAW_URL_REMOTE = `https://raw.githubusercontent.com/openpotato/openplzapi.data/main/src/de/osm/${FILE_NAME}`;
const LOCAL_PATH = ".";

const localFilePath = path.join(__dirname, LOCAL_PATH, FILE_NAME);
const etagFilePath = `${localFilePath}.etag`;

async function syncStreetNamesFile() {
  try {
    let localETag: string | null = null;
    try {
      localETag = fs.readFileSync(etagFilePath, "utf8"); // Throws error if not existing
      fs.accessSync(localFilePath);
      console.log(
        `Found ETag ${localETag}, checking whether still up-to-date...`,
      );
    } catch {
      console.warn("ETag file not found, re-downloading...");
    }

    const headers: Record<string, string> = localETag
      ? { "If-None-Match": localETag }
      : {};

    console.log(`Fetching ${RAW_URL_REMOTE}`);
    const response = await fetch(RAW_URL_REMOTE, { headers });

    // If the Etag matches the remote, it returns a '304 Not Modified'
    if (response.status === 304) {
      console.log("✅ Local file matches remote, skipping download.");
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

    generateStreetNamesJson().catch((err) => {
      console.error("❌ Failed to generate JSON:", err);
    });

    console.log("✅ Download complete and local file updated.");
  } catch (error) {
    console.error("❌ An error occurred:", error);
  }
}

syncStreetNamesFile();
