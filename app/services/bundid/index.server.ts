/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from "node:fs";
import path from "node:path";
// @ts-ignore optional dependency
import saml from "samlify";
// @ts-ignore optional dependency
import type { IdentityProvider } from "samlify/types/src/entity-idp";
// @ts-ignore optional dependency
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

    const pathToPrivateKeyEncryption = path.resolve(
      config().SAML_SP_SECRET_KEY_ENCRYPTION_PATH,
    );
    const privateKeyEncryption = fs.readFileSync(pathToPrivateKeyEncryption);

    const pathToLoginRequestTemplate = path.resolve(
      config().SAML_SP_LOGIN_REQUEST_TEMPLATE_PATH,
    );
    const loginRequestTemplate = fs
      .readFileSync(pathToLoginRequestTemplate)
      .toString("utf8");

    bundIdServiceProvider = saml.ServiceProvider({
      metadata: spMetadata,
      encPrivateKey: privateKeyEncryption,
      privateKey,
      wantAssertionsSigned: true,
      loginRequestTemplate: { context: loginRequestTemplate },
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
      isAssertionEncrypted: true,
      messageSigningOrder: "encrypt-then-sign",
    });
  }
  return bundIdIdentityProvider;
};
