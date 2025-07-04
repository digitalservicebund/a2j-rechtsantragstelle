import { useLoaderData } from "react-router";
import ContentComponents from "~/components/ContentComponents";
import { fetchPage } from "~/services/cms/index.server";

export const loader = async () => {
  const { pageMeta, ...props } = await fetchPage("/");
  return { ...props, meta: pageMeta };
};

export default function Index() {
  return <ContentComponents content={useLoaderData<typeof loader>().content} />;
}
