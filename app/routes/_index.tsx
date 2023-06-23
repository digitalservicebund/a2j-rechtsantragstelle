import type { V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PageContent from "~/components/PageContent";
import { getStrapiPage } from "~/services/cms";

export const loader = async () => {
  return json(await getStrapiPage({ slug: "/" }));
};

export const meta: V2_MetaFunction<typeof loader> = ({ location, data }) => [
  {
    title: data?.meta.title ?? location.pathname,
    name: "robots",
    content: "noindex",
  },
];

export default function Index() {
  return <PageContent content={useLoaderData<typeof loader>().content} />;
}
