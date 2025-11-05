import { config } from "~/services/env/env.server";
import { SAML } from "@node-saml/node-saml";
export function getBundIdServiceProvider() {
  const saml = new SAML({
    entryPoint: "https://int.id.bund.de/idp/profile/SAML2/POST/SSO",
    issuer: config().BUNDID_AUTH_BMI_ID ?? "",
    callbackUrl: config().SAML_ASSERTION_CONSUMER_SERVICE_URL ?? "",
    idpCert: config().SAML_IDP_CERT ?? "",
    wantAssertionsSigned: true,
  });
  return saml;
}
