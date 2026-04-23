// oxlint-disable no-console
import fs from "node:fs";
import zlib from "node:zlib";
import { configDotenv } from "dotenv";
import {
  COURT_DATA_FILEPATH,
  getCipher,
} from "~/services/gerichtsfinder/encryptedStorage.server";
import { applyDataConversions } from "~/services/gerichtsfinder/convertJsonDataTable";
import { extractJsonFilesFromZip } from "~/util/file/extractJsonFilesFromZip";

export function saveEncrypted(data: any, filename: string, password: string) {
  const packed = zlib.gzipSync(JSON.stringify(data));
  const cipher = getCipher(password, true);
  const encrypted = Buffer.concat([cipher.update(packed), cipher.final()]);
  fs.writeFileSync(filename, encrypted);
}

export default function updateZipfile(zipFilepath: string) {
  configDotenv();
  const { GERICHTSFINDER_ENCRYPTION_KEY } = process.env;
  if (!GERICHTSFINDER_ENCRYPTION_KEY) {
    console.error("GERICHTSFINDER_ENCRYPTION_KEY not set - aborting.");
    return;
  }
  const jsonObjects = extractJsonFilesFromZip(zipFilepath);
  console.log("Converting...");
  const convertedData = applyDataConversions(jsonObjects);
  console.log(`Saving encrypted data to ${COURT_DATA_FILEPATH}`);
  saveEncrypted(
    convertedData,
    COURT_DATA_FILEPATH,
    GERICHTSFINDER_ENCRYPTION_KEY,
  );
}
