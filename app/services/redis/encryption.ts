import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  hkdfSync,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const ENCRYPTION_PREFIX = Buffer.from([0x01, 0x45, 0x4e, 0x43]); // \x01ENC

const deriveKey = (userKey: string, uuid: string) =>
  Buffer.from(hkdfSync("sha256", userKey, uuid, "form-session-v1", 32));

const isBufferEncrypted = (buffer: Buffer) =>
  buffer.length >= 4 && buffer.subarray(0, 4).equals(ENCRYPTION_PREFIX);

export function pack(
  data: Record<string, unknown>,
  uuid: string,
  userKey?: string,
): Buffer {
  const plaintext = JSON.stringify(data);

  if (userKey) {
    const key = deriveKey(userKey, uuid);
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv);

    const ciphertext = Buffer.concat([
      cipher.update(plaintext, "utf8"),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([ENCRYPTION_PREFIX, iv, tag, ciphertext]);
  }

  return Buffer.from(plaintext, "utf8");
}

export function unpack(
  buffer: Buffer,
  uuid: string,
  userKey?: string,
): Record<string, unknown> | null {
  try {
    if (!isBufferEncrypted(buffer)) return JSON.parse(buffer.toString("utf8"));

    if (!userKey) throw new Error("Data is encrypted but no key provided.");

    const key = deriveKey(userKey, uuid);
    const iv = buffer.subarray(4, 4 + IV_LENGTH);
    const tag = buffer.subarray(4 + IV_LENGTH, 4 + IV_LENGTH + TAG_LENGTH);
    const cipherText = buffer.subarray(4 + IV_LENGTH + TAG_LENGTH);
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    const decrypted =
      decipher.update(cipherText, undefined, "utf8") + decipher.final("utf8");
    return JSON.parse(decrypted);
  } catch (error) {
    // oxlint-disable-next-line no-console
    console.error(
      "[Vault] Unpack failed:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
