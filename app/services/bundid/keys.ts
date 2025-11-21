import { readFileSync } from "node:fs";
import { config } from "../env/env.server";

export function samlKeys() {
  const { SAML_SP_SECRET_KEY_ENCRYPTION_PATH, SAML_SP_SECRET_KEY_PATH } =
    config();
  let privateKey: string | undefined = undefined;
  let decryptionPvk: string | undefined = undefined;

  try {
    privateKey = readFileSync(SAML_SP_SECRET_KEY_PATH, "utf-8");
    decryptionPvk = readFileSync(SAML_SP_SECRET_KEY_ENCRYPTION_PATH, "utf-8");
  } catch (err) {
    // oxlint-disable-next-line no-console
    console.error(err);
  }
  return { privateKey, decryptionPvk };
}
