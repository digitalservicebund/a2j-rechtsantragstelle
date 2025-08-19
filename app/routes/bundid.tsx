import { Outlet, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import invariant from "tiny-invariant";
import Button from "~/components/common/Button";
import {
  getBundIdIdentityProvider,
  getBundIdServiceProvider,
} from "~/services/bundid/index.server";
import { config } from "~/services/env/env.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagDisabled("showBundID");

  const { BUNDID_AUTH_BMI_ID, SAML_ASSERTION_CONSUMER_SERVICE_URL } = config();
  invariant(BUNDID_AUTH_BMI_ID, "BUNDID_AUTH_BMI_ID has to be set");
  invariant(
    SAML_ASSERTION_CONSUMER_SERVICE_URL,
    "SAML_ASSERTION_CONSUMER_SERVICE_URL has to be set",
  );

  const identityProvider = getBundIdIdentityProvider();
  const serviceProvider = getBundIdServiceProvider();

  const backURL = request.url;

  const loginRequest = serviceProvider.createLoginRequest(
    identityProvider,
    "post",
    (template: string) => {
      const id = crypto.randomUUID();
      return {
        id: id,
        context: template
          .replace(
            "{AssertionConsumerServiceURL}",
            SAML_ASSERTION_CONSUMER_SERVICE_URL,
          )
          .replace("{ID}", id)
          .replace("{IssueInstant}", new Date().toISOString())
          .replace("{OnlineServiceID}", BUNDID_AUTH_BMI_ID)
          .replace("{BackURL}", backURL),
      };
    },
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
