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
    // 1. Read our locally saved ETag (if both the data file and ETag file exist)
    const localETag =
      fs.existsSync(etagFilePath) && fs.existsSync(localFilePath)
        ? fs.readFileSync(etagFilePath, "utf8")
        : null;

    const headers: Record<string, string> = localETag
      ? { "If-None-Match": localETag }
      : {};

    console.log(`Checking for updates: ${RAW_URL_REMOTE}...`);
    const response = await fetch(RAW_URL_REMOTE, { headers });

    // 3. Handle a 304 Not Modified response (File hasn't changed!)
    if (response.status === 304) {
      console.log("✅ Local file matches remote, skipping download.");
      return;
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch raw file: ${response.status} ${response.statusText}`,
      );
    }

    // 4. If we get a 200 OK, the file is new or modified. Download it.
    console.log("Remote file is new or updated. Downloading...");
    fs.writeFileSync(localFilePath, Buffer.from(await response.arrayBuffer()));

    // 5. Save the new ETag for the next time we run the script
    const newETag = response.headers.get("etag");
    if (newETag) {
      fs.writeFileSync(etagFilePath, newETag);
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
