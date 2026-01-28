import { config } from "~/services/env/env.server";
import { SAML } from "@node-saml/node-saml";
import { samlKeys } from "./keys";
import { attributeSchema, samlAuthnRequestExtensions } from "./attributes";
import { config as publicConfig } from "../env/public";

function getBundIdSaml(backUrl?: string) {
  const {
    BUNDID_ENTITY_ID,
    SAML_ASSERTION_CONSUMER_SERVICE_URL,
    SAML_IDP_CERT,
  } = config();
  const { BUNDID_IDP_ENTRY_POINT } = publicConfig();

  const { privateKey, decryptionPvk } = samlKeys();

  return new SAML({
    entryPoint: BUNDID_IDP_ENTRY_POINT,
    issuer: BUNDID_ENTITY_ID,
    callbackUrl: SAML_ASSERTION_CONSUMER_SERVICE_URL,
    idpCert: SAML_IDP_CERT,
    privateKey,
    decryptionPvk,
    authnRequestBinding: "HTTP-POST",
    skipRequestCompression: true,
    wantAssertionsSigned: true,
    racComparison: "minimum",
    authnContext: ["STORK-QAA-Level-1"],
    signatureAlgorithm: "sha256-mgf1",
    samlAuthnRequestExtensions: samlAuthnRequestExtensions(backUrl),
    acceptedClockSkewMs: 5000,
    disableRequestedAuthnContext: false,
    forceAuthn: true,
    identifierFormat: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
  });
}

export async function generateSamlRequest(backUrl: string) {
  const serviceProvider = getBundIdSaml(backUrl);
  const samlRequest = await serviceProvider.getAuthorizeMessageAsync("");
  return {
    url: serviceProvider.options.entryPoint,
    samlRequest: samlRequest.SAMLRequest as string,
  };
}

export async function validateSamlResponse(container: Record<string, string>) {
  const { profile } =
    await getBundIdSaml().validatePostResponseAsync(container);
  return attributeSchema.parse(profile);
}
