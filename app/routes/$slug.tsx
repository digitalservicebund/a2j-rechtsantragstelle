import { json } from "@remix-run/node";
import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPageConfig } from "~/services/cms/getPageConfig";
import PageContent from "~/components/PageContent";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  { title: data.title },
];

export const loader: LoaderFunction = async ({ request }) => {
  const config = await getPageConfig(request.url, { dontThrow: true });

  if (!config) {
    throw json(null, { status: 404 });
  }

  return json({ ...config });
};

export default function Page() {
  const data = useLoaderData();

  return <PageContent {...data} />;
}
