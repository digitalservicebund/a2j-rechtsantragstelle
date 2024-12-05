import type { ActionFunctionArgs } from "@remix-run/node";
import Button from "~/components/Button";
import { throw404OnProduction } from "~/services/errorPages/throw404";
import invariant from "tiny-invariant";
import { config } from "~/services/env/env.server";
import saml from "samlify";
import path from "path";
import fs from "fs";
import * as samlify from "samlify";

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
  console.log("FormData:", formData);

  const samlResponse = formData.get("SAMLResponse");
  console.log({ samlResponse });
  if (typeof samlResponse !== "string") {
    throw new Error("Invalid SAML Response");
  }

  const samlHttpRequest = {
    body: {
      SAMLResponse: samlResponse,
    },
  };

  samlify.setSchemaValidator({
    validate: (response: string) => {
      return Promise.resolve("skipped");
    },
  });

  const response = await sp.parseLoginResponse(idp, "post", samlHttpRequest);
  console.log("HERE");
  console.log({ response });

  console.log("Attributes:", response.extract.attributes);
  console.log("Nachname:", response.extract.attributes["urn:oid:2.5.4.4"]);
  return null;
};

export default function View() {
  return (
    <div>
      <h1>BundID Success Test</h1>
      <form action={"/bundid/success"} method="post">
        <input type="hidden" name="test" value="HI" />
        <Button type={"submit"}>Mock POST request</Button>
      </form>
    </div>
  );
}
