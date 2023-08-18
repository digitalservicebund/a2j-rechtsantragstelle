import { type LoaderArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { fetchMeta } from "~/services/cms/index.server";

export async function loader({ request }: LoaderArgs) {
  const { pathname } = new URL(request.url);
  const slug = `/${pathname.split("/").at(1) ?? ""}`;
  return json({ meta: await fetchMeta({ slug }) });
}

export default function View() {
  return <Outlet />;
}
