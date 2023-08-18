import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PageContent from "~/components/PageContent";
import { fetchCollectionEntry } from "~/services/cms/index.server";

export const loader = async () => {
  return json(await fetchCollectionEntry("pages", "/"));
};

export default function Index() {
  return <PageContent content={useLoaderData<typeof loader>().content} />;
}
