import { useLoaderData } from "react-router";
import StrapiContentComponents from "~/components/StrapiContentComponents";
import { fetchPage } from "~/services/cms/index.server";

export const loader = async () => {
  const { pageMeta, ...props } = await fetchPage("/");
  return { ...props, meta: pageMeta };
};

export default function Index() {
  return (
    <StrapiContentComponents content={useLoaderData<typeof loader>().content} />
  );
}
