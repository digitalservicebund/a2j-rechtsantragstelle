/* eslint-disable no-console */
/* eslint no-var: 0, @typescript-eslint/no-explicit-any: 0*/
// Update zip file using pnpm run update:courtData -- /path/to/file.zip

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import dotenv from "dotenv";
import { applyDataConversions } from "./convertJsonDataTable";
import { extractJsonFilesFromZip } from "../../util/file/extractJsonFilesFromZip";

dotenv.config();
const GERICHTSFINDER_ENCRYPTION_KEY = process.env.GERICHTSFINDER_ENCRYPTION_KEY;
const OUTFILE = path.resolve(
  path.join(process.cwd(), "data/courts/courtData.enc"),
);

function getCipher(password: string, forward: boolean) {
  const func = forward ? crypto.createCipheriv : crypto.createDecipheriv;
  return func(
    "aes-256-cbc",
    crypto.scryptSync(password, "salt", 32),
    Buffer.alloc(16, 0),
  );
}

function loadEncrypted(filename: string, password: string) {
  const fileBuf = fs.readFileSync(filename);
  const decipher = getCipher(password, false);
  const decrypted = Buffer.concat([decipher.update(fileBuf), decipher.final()]);
  const unpacked = zlib.gunzipSync(decrypted).toString();
  return JSON.parse(unpacked) as Record<string, unknown>;
}

function saveEncrypted(data: any, filename: string, password: string) {
  const packed = zlib.gzipSync(JSON.stringify(data));
  const cipher = getCipher(password, true);
  const encrypted = Buffer.concat([cipher.update(packed), cipher.final()]);
  fs.writeFileSync(filename, encrypted);
}

function updateZipfile(zipFilepath: string) {
  if (!GERICHTSFINDER_ENCRYPTION_KEY) {
    console.error("GERICHTSFINDER_ENCRYPTION_KEY not set - aborting.");
    return;
  }
  const jsonObjects = extractJsonFilesFromZip(zipFilepath);
  console.log("Converting...");
  const convertedData = applyDataConversions(jsonObjects);
  console.log(`Saving encrypted data to ${OUTFILE}`);
  saveEncrypted(convertedData, OUTFILE, GERICHTSFINDER_ENCRYPTION_KEY);
}

// Caching file read, decryption & parsing to survive server reload
// See https://remix.run/docs/en/1.16.1/tutorials/jokes#connect-to-the-database
declare global {
  // eslint-disable-next-line sonarjs/no-var
  var __encData: Record<string, any> | undefined; // NOSONAR
}

export function getEncrypted(): Record<string, any> {
  if (!GERICHTSFINDER_ENCRYPTION_KEY) {
    console.error("GERICHTSFINDER_ENCRYPTION_KEY not set - aborting.");
    return {};
  }
  if (global.__encData === undefined) {
    try {
      global.__encData = loadEncrypted(OUTFILE, GERICHTSFINDER_ENCRYPTION_KEY);
    } catch (error) {
      console.error(error);
      return {};
    }
  }
  return global.__encData ?? {};
}

if (process.argv[2] === "updateZip") updateZipfile(process.argv[3]);
