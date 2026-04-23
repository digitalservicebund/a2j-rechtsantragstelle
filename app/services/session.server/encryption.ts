import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  hkdfSync,
  type CipherKey,
} from "node:crypto";
import { logError } from "../logging";
import { config } from "../env/env.server";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const ENCRYPTION_PREFIX = Buffer.from([0x01, 0x45, 0x4e, 0x43]); // \x01ENC

export const deriveCipherKey = (salt: string, vaultKey?: string) =>
  vaultKey
    ? Buffer.from(hkdfSync("sha256", vaultKey, salt, "form-session-v1", 32))
    : undefined;

const isBufferEncrypted = (buffer: Buffer) =>
  buffer.length >= 4 && buffer.subarray(0, 4).equals(ENCRYPTION_PREFIX);

export function pack(
  data: Record<string, unknown>,
  cipherKey?: CipherKey,
): Buffer {
  const plaintext = JSON.stringify(data);
  if (!cipherKey || !config().ENABLE_SESSION_ENCRYPTION)
    return Buffer.from(plaintext, "utf8");

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, cipherKey, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([ENCRYPTION_PREFIX, iv, tag, ciphertext]);
}

export function unpack(
  buffer: Buffer,
  cipherKey?: CipherKey,
): Record<string, unknown> | null {
  try {
    if (!isBufferEncrypted(buffer)) return JSON.parse(buffer.toString("utf8"));
    if (!cipherKey) throw new Error("Data is encrypted but no key provided.");

    const iv = buffer.subarray(4, 4 + IV_LENGTH);
    const tag = buffer.subarray(4 + IV_LENGTH, 4 + IV_LENGTH + TAG_LENGTH);
    const cipherText = buffer.subarray(4 + IV_LENGTH + TAG_LENGTH);
    const decipher = createDecipheriv(ALGORITHM, cipherKey, iv);
    decipher.setAuthTag(tag);

    const decrypted =
      decipher.update(cipherText, undefined, "utf8") + decipher.final("utf8");
    return JSON.parse(decrypted);
  } catch (error) {
    logError({ error });
    return null;
  }
}
