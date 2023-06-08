import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import PageContent from "~/components/PageContent";
import { getStrapiPage } from "~/services/cms";

export const meta: V2_MetaFunction<typeof loader> = ({ data, location }) => [
  { title: data ? data.meta.title : location.pathname },
];

export const loader: LoaderFunction = async () => {
  const page = await getStrapiPage({ slug: "beratungshilfe" });
  return json({
    content: page.content,
    meta: page.meta,
  });
};

export default function Index() {
  return <PageContent content={useLoaderData<typeof loader>().content} />;
}
