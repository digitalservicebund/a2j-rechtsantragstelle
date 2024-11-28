import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { fetchMeta } from "~/services/cms/index.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { pathname } = new URL(request.url);
  const filterValue = `/${pathname.split("/").at(1) ?? ""}`;
  return json({ meta: await fetchMeta({ filterValue }) });
}

export default function View() {
  return <Outlet />;
}
