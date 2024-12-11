import { Outlet, useLoaderData } from "@remix-run/react";
import Button from "~/components/Button";
import {
  getBundIdIdentityProvider,
  getBundIdServiceProvider,
} from "~/services/bundid/index.server";
import { throw404OnProduction } from "~/services/errorPages/throw404";

export const loader = () => {
  throw404OnProduction();

  const identityProvider = getBundIdIdentityProvider();
  const serviceProvider = getBundIdServiceProvider();

  const loginRequest = serviceProvider.createLoginRequest(
    identityProvider,
    "post",
  );
  return {
    url: "https://int.id.bund.de/idp/profile/SAML2/POST/SSO",
    samlRequest: loginRequest.context,
  };
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
