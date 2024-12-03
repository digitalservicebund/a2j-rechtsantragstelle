import fs from "fs";
import path from "path";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import saml from "samlify";
import invariant from "tiny-invariant";
import Button from "~/components/Button";
import { config } from "~/services/env/env.server";
import { throw404OnProduction } from "~/services/errorPages/throw404";

// IDP xml
// Ort für xmls finden
// Keys + certs in sealed secret
// proper feature toggle
// extend XML with specific BundID attributes

export const loader = () => {
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
  });

  const pathToSpMetadata = path.resolve(config().SAML_SP_METADATA_PATH);
  const spMetadata = fs.readFileSync(pathToSpMetadata);

  const pathToPrivateKey = path.resolve(config().SAML_SP_SECRET_KEY_PATH);
  const privateKey = fs.readFileSync(pathToPrivateKey);

  // eslint-disable-next-line sonarjs/new-cap
  const sp = saml.ServiceProvider({
    metadata: spMetadata,
    privateKey,
  });

  const loginRequest = sp.createLoginRequest(idp, "post");
  return json({
    url: "https://int.id.bund.de/idp/profile/SAML2/POST/SSO",
    samlRequest: loginRequest.context,
  });
};

export default function View() {
  const { url, samlRequest } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>BundID Test</h1>
      <form action={url} method="post">
        <input type="hidden" name="SAMLRequest" value={samlRequest} />
        <Button type={"submit"}>Identifizieren</Button>
      </form>
      <Outlet />
    </div>
  );
}
