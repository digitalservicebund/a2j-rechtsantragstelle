import { Outlet, useLoaderData, type LoaderFunctionArgs } from "react-router";
import KernButton from "~/components/kern/KernButton";
import { generateSamlRequest } from "~/services/bundid/index.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagDisabled("showBundID");
  return generateSamlRequest(request.url);
};

export default function View() {
  const { url, samlRequest } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>BundID Test</h1>
      <form action={url} method="post">
        <input type="hidden" name="SAMLRequest" value={samlRequest} />
        <KernButton type={"submit"}>Identifizieren</KernButton>
      </form>
      <Outlet />
    </div>
  );
}
