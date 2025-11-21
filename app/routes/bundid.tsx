import { Outlet, useLoaderData } from "react-router";
import Button from "~/components/common/Button";
import { getBundIdSaml } from "~/services/bundid/index.server";
import { config } from "~/services/env/env.server";

import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";

export const loader = async () => {
  const { SAML_ASSERTION_CONSUMER_SERVICE_URL } = config();
  await throw404IfFeatureFlagDisabled("showBundID");
  const serviceProvider = getBundIdSaml();
  const samlRequest = await serviceProvider.getAuthorizeMessageAsync(
    SAML_ASSERTION_CONSUMER_SERVICE_URL,
  );

  return {
    url: serviceProvider.options.entryPoint,
    samlRequest: samlRequest.SAMLRequest as string,
    relayState: SAML_ASSERTION_CONSUMER_SERVICE_URL,
  };
};

export default function View() {
  const { url, samlRequest, relayState } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>BundID Test</h1>
      <form action={url} method="post">
        <input type="hidden" name="SAMLRequest" value={samlRequest} />
        <input type="hidden" name="RelayState" value={relayState} />
        <Button type={"submit"}>Identifizieren</Button>
      </form>
      <Outlet />
    </div>
  );
}
