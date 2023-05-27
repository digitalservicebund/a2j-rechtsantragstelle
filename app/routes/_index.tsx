import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PageContent from "~/components/PageContent";
import { getPage } from "~/services/cms";

export const loader: LoaderFunction = async () => {
  return json(await getPage({ slug: "index" }));
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data.meta.title,
    name: "robots",
    content: "noindex",
  },
];

export default function Index() {
  return <PageContent content={useLoaderData().content} />;
}
