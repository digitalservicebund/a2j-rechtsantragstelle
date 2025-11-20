import { Outlet, useLoaderData } from "react-router";
import Button from "~/components/common/Button";
import { getBundIdSamlConfig } from "~/services/bundid/index.server";

import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";

const backURL = "https://a2j-staging.dev.ds4g.net/bundid/success";

export const loader = async () => {
  await throw404IfFeatureFlagDisabled("showBundID");
  const serviceProvider = getBundIdSamlConfig();
  const samlRequest = await serviceProvider.getAuthorizeMessageAsync(backURL);

  return {
    url: serviceProvider.options.entryPoint,
    samlRequest: samlRequest.SAMLRequest as string,
    relayState: backURL,
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
