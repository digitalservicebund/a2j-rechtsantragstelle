import fs from "fs";
import path from "path";
import type { ActionFunctionArgs } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import saml from "samlify";
import * as samlify from "samlify";
import invariant from "tiny-invariant";
import { config } from "~/services/env/env.server";
import { throw404OnProduction } from "~/services/errorPages/throw404";

export const loader = () => {
  throw404OnProduction();
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  throw404OnProduction();

  invariant(config().SAML_IDP_CERT, "SAML_IDP_CERT has to be set");
  // eslint-disable-next-line sonarjs/new-cap
  const idp = saml.IdentityProvider({
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

  const pathToSpMetadata = path.resolve(config().SAML_SP_METADATA_PATH);
  const spMetadata = fs.readFileSync(pathToSpMetadata);

  const pathToPrivateKey = path.resolve(config().SAML_SP_SECRET_KEY_PATH);
  const privateKey = fs.readFileSync(pathToPrivateKey);

  // eslint-disable-next-line sonarjs/new-cap
  const sp = saml.ServiceProvider({
    metadata: spMetadata,
    encPrivateKey: privateKey,
    privateKey,
    wantAssertionsSigned: true,
  });

  const formData = await request.formData();
  const samlResponse = formData.get("SAMLResponse");

  if (typeof samlResponse !== "string") {
    throw new Error("Invalid SAML Response");
  }

  const samlHttpRequest = {
    body: {
      SAMLResponse: samlResponse,
    },
  };

  samlify.setSchemaValidator({
    validate: (_: string) => {
      return Promise.resolve("skipped");
    },
  });

  const response = await sp.parseLoginResponse(idp, "post", samlHttpRequest);
  const responseAtributes = response.extract.attributes;

  const BUNDID_PRENAME_KEY = "urn:oid:2.5.4.42";
  const BUNDID_SURNAME_KEY = "urn:oid:2.5.4.4";
  return {
    prename: responseAtributes[BUNDID_PRENAME_KEY],
    surname: responseAtributes[BUNDID_SURNAME_KEY],
  };
};

export default function View() {
  const actionData = useActionData<typeof action>();
  return (
    <div>
      <span>Vorname: {actionData?.prename}</span>
      <span>Nachname: {actionData?.surname}</span>
    </div>
  );
}
