import { useLoaderData } from "@remix-run/react";
import PageContent from "~/components/PageContent";
import { fetchPage } from "~/services/cms/index.server";

export const loader = async () => {
  return await fetchPage("/");
};

export default function Index() {
  return <PageContent content={useLoaderData<typeof loader>().content} />;
}
