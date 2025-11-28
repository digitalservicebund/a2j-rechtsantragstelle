/* oxlint-disable no-console */
/* eslint no-var: 0, @typescript-eslint/no-explicit-any: 0*/
// Update zip file using pnpm run update:courtData -- /path/to/file.zip

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { configDotenv } from "dotenv";
import { config } from "~/services/env/env.server";
import { applyDataConversions } from "./convertJsonDataTable";
import { extractJsonFilesFromZip } from "../../util/file/extractJsonFilesFromZip";
import { env } from "node:process";

const getEncryptionKey = () => config().GERICHTSFINDER_ENCRYPTION_KEY;
const getEncryptionKeyOld = () => config().GERICHTSFINDER_ENCRYPTION_KEY_OLD;
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

function loadEncrypted(filename: string, password?: string) {
  if (!password) return undefined;
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
  configDotenv(); // updateZipfile runs as part of an npm command and might need to read from
  const GERICHTSFINDER_ENCRYPTION_KEY = getEncryptionKey();

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
  // oxlint-disable-next-line no-var
  var __encData: Record<string, any> | undefined; // NOSONAR
}

export function rotateKey() {
  // Re-encrypt the file using GERICHTSFINDER_ENCRYPTION_KEY. This only changes the file if it has been encrypted with GERICHTSFINDER_ENCRYPTION_KEY_OLD
  const newKey = env.GERICHTSFINDER_ENCRYPTION_KEY;
  if (!newKey) throw new Error("Error: no new key provided, aborting...");
  saveEncrypted(getEncrypted(), OUTFILE, newKey);
}

function tryDecrypt(key?: string, showError = true) {
  try {
    return loadEncrypted(OUTFILE, key);
  } catch {
    if (showError) console.error("Decryption failed!");
  }
}

export function getEncrypted(): Record<string, any> {
  // if global.__encData is undefined, try to decrypt using the current key and fallback to the old key
  global.__encData ??=
    tryDecrypt(getEncryptionKey(), false) ?? tryDecrypt(getEncryptionKeyOld());
  return global.__encData ?? {};
}

if (process.argv[2] === "updateZip") updateZipfile(process.argv[3]);
if (process.argv[2] === "rotateKey") rotateKey();
