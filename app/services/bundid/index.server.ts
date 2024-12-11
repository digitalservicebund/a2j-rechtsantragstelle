import fs from "fs";
import path from "path";
import saml from "samlify";
import type { IdentityProvider } from "samlify/types/src/entity-idp";
import type { ServiceProvider } from "samlify/types/src/entity-sp";
import invariant from "tiny-invariant";
import { config } from "~/services/env/env.server";

let bundIdServiceProvider: ServiceProvider;
let bundIdIdentityProvider: IdentityProvider;

export const getBundIdServiceProvider = () => {
  if (!bundIdServiceProvider) {
    const pathToSpMetadata = path.resolve(config().SAML_SP_METADATA_PATH);
    const spMetadata = fs.readFileSync(pathToSpMetadata);

    const pathToPrivateKey = path.resolve(config().SAML_SP_SECRET_KEY_PATH);
    const privateKey = fs.readFileSync(pathToPrivateKey);

    bundIdServiceProvider = saml.ServiceProvider({
      metadata: spMetadata,
      privateKey,
    });
  }
  return bundIdServiceProvider;
};

export const getBundIdIdentityProvider = () => {
  if (!bundIdIdentityProvider) {
    invariant(config().SAML_IDP_CERT, "SAML_IDP_CERT has to be set");
    bundIdIdentityProvider = saml.IdentityProvider({
      // Reading the data from file does not work because wantAuthnRequestsSigned is not set
      // and even setting it (WantAuthnRequestsSigned="true") doesn't solve the issue.
      wantAuthnRequestsSigned: true,
      entityID: "https://int.id.bund.de/idp",
      singleSignOnService: [
        {
          Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
          Location: "https://int.id.bund.de/idp/profile/SAML2/POST/SSO",
        },
      ],
      signingCert: config().SAML_IDP_CERT,
    });
  }
  return bundIdIdentityProvider;
};
