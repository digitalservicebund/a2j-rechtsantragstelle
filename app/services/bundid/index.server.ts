import { config } from "~/services/env/env.server";
import { SAML } from "@node-saml/node-saml";
import { samlKeys } from "./keys";
import { samlAuthnRequestExtensions } from "./attributes";

export function getBundIdSaml() {
  const { SAML_ASSERTION_CONSUMER_SERVICE_URL, SAML_IDP_CERT } = config();
  const { privateKey, decryptionPvk } = samlKeys();

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
