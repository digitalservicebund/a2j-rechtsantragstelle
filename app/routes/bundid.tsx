import { Outlet, useLoaderData } from "react-router";
import Button from "~/components/common/Button";
import { generateSamlRequest } from "~/services/bundid/index.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";

export const loader = async () => {
  await throw404IfFeatureFlagDisabled("showBundID");
  return generateSamlRequest();
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
