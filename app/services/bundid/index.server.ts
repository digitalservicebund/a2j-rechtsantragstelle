import { config } from "~/services/env/env.server";
import { SAML } from "@node-saml/node-saml";
import { readFileSync } from "node:fs";
import { samlAuthnRequestExtensions } from "./attributes";

export function getBundIdSamlConfig() {
  const {
    SAML_ASSERTION_CONSUMER_SERVICE_URL,
    SAML_IDP_CERT,
    SAML_SP_SECRET_KEY_ENCRYPTION_PATH,
    SAML_SP_SECRET_KEY_PATH,
  } = config();

  let privateKey: string | undefined;
  let decryptionPvk: string | undefined;

  try {
    privateKey = readFileSync(SAML_SP_SECRET_KEY_PATH, "utf-8");
    decryptionPvk = readFileSync(SAML_SP_SECRET_KEY_ENCRYPTION_PATH, "utf-8");
  } catch (err) {
    // oxlint-disable-next-line no-console
    console.error(err);
  }

  return new SAML({
    entryPoint: "https://int.id.bund.de/idp/profile/SAML2/POST/SSO",
    issuer: "https://service.justiz.de/sp",
    callbackUrl: SAML_ASSERTION_CONSUMER_SERVICE_URL,
    idpCert: SAML_IDP_CERT ?? "",
    privateKey,
    decryptionPvk,
    authnRequestBinding: "HTTP-POST",
    skipRequestCompression: true,
    wantAssertionsSigned: true,
    racComparison: "minimum",
    authnContext: ["STORK-QAA-Level-1"],
    signatureAlgorithm: "sha256-mgf1",
    samlAuthnRequestExtensions,
    acceptedClockSkewMs: 5000,
    disableRequestedAuthnContext: false,
    forceAuthn: false,
  });
}
