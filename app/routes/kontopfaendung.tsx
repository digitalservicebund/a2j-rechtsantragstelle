import { type LoaderFunctionArgs } from "react-router";
import { Outlet } from "react-router";
import { fetchMeta } from "~/services/cms/index.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { pathname } = new URL(request.url);
  const filterValue = `/${pathname.split("/").at(1) ?? ""}`;
  return { meta: await fetchMeta({ filterValue }) };
}

export default function View() {
  return <Outlet />;
}
