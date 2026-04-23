/* oxlint-disable no-console */
// Update zip file using pnpm run update:courtData /path/to/file.zip

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { config } from "~/services/env/env.server";

const getEncryptionKey = () => config().GERICHTSFINDER_ENCRYPTION_KEY;
const getEncryptionKeyOld = () => config().GERICHTSFINDER_ENCRYPTION_KEY_OLD;
export const COURT_DATA_FILEPATH = path.resolve(
  path.join(process.cwd(), "data/courts/courtData.enc"),
);

export function getCipher(password: string, forward: boolean) {
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

// Caching file read, decryption & parsing to survive server reload
// See https://remix.run/docs/en/1.16.1/tutorials/jokes#connect-to-the-database
declare global {
  // oxlint-disable-next-line no-var
  var __encData: Record<string, any> | undefined; // NOSONAR
}

function tryDecrypt(key?: string, showError = true) {
  try {
    return loadEncrypted(COURT_DATA_FILEPATH, key);
  } catch {
    if (showError) console.error("Decryption failed!");
  }
}

export function getEncrypted(): Record<string, any> {
  // if global.__encData is undefined, try to decrypt using the current key and fallback to the old key
  globalThis.__encData ??=
    tryDecrypt(getEncryptionKey(), false) ?? tryDecrypt(getEncryptionKeyOld());
  return globalThis.__encData ?? {};
}
