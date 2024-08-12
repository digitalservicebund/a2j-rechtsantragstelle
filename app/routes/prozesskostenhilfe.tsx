import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { fetchMeta } from "~/services/cms/index.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";

export async function loader({ request }: LoaderFunctionArgs) {
  await throw404IfFeatureFlagDisabled("showProzesskostenhilfeFlow");
  const { pathname } = new URL(request.url);
  const filterValue = `/${pathname.split("/").at(1) ?? ""}`;
  return json({ meta: await fetchMeta({ filterValue }) });
}

export default function View() {
  return <Outlet />;
}
