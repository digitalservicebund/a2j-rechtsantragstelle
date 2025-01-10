import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PageContent from "~/components/PageContent";
import { fetchPage } from "~/services/cms/index.server";

export const loader = async () => {
  const { pageMeta, ...props } = await fetchPage("/");
  return json({ ...props, meta: pageMeta });
};

export default function Index() {
  return <PageContent content={useLoaderData<typeof loader>().content} />;
}
