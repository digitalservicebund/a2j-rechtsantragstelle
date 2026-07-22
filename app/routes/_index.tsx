import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { fetchPage } from "~/services/cms/index.server";
import Homepage from "./shared/components/Homepage";

export const loader = async () => {
  const { pageMeta, ...props } = await fetchPage("/");
  return { ...props, meta: pageMeta };
};

export default function Index() {
  const { content } = useLoaderData<typeof loader>();
  return (
    <>
      <ContentComponents content={content} />
      <Homepage />
    </>
  );
}
