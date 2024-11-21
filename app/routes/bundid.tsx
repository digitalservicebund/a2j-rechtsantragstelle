import fs from "fs";
import path from "path";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import saml from "samlify";
import Button from "~/components/Button";
import { throw404OnProduction } from "~/services/errorPages/throw404";

// IDP xml
// Ort für xmls finden
// Keys + certs in sealed secret
// proper feature toggle
// extend XML with specific BundID attributes

export const loader = async () => {
  throw404OnProduction();

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
    // get it from https://int.id.bund.de/idp
    signingCert: "",
  });

  /*

   */
  const pathToSpMetadata = path.resolve(
    path.join(process.cwd(), "path/to/sp_metadata.xml"),
  );
  const spMetadata = fs.readFileSync(pathToSpMetadata);

  const pathToPrivateKey = path.resolve(
    path.join(process.cwd(), "path/to/sp_privateKey.pem"),
  );
  const privateKey = fs.readFileSync(pathToPrivateKey);

  /*
  const pathToTemplate = path.resolve(
    path.join(process.cwd(), "path/to/auth_request_template.xml"),
  );
  const template = Buffer.from(fs.readFileSync(pathToTemplate)).toString()
*/

  const sp = saml.ServiceProvider({
    metadata: spMetadata,
    privateKey,
    /*
    loginRequestTemplate: {
      context: template,
    }
     */
  });

  const loginRequest = sp.createLoginRequest(idp, "post");
  return json({
    url: "https://int.id.bund.de/idp/profile/SAML2/POST/SSO",
    samlRequest: loginRequest.context,
  });
};

export default function View() {
  const loaderData = useLoaderData();

  return (
    <div>
      <h1>BundID Test</h1>
      <form action={loaderData["url"]} method="post">
        <input
          type="hidden"
          name="SAMLRequest"
          value={loaderData["samlRequest"]}
        />
        <Button type={"submit"}>Identifizieren</Button>
      </form>
    </div>
  );
}
