import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { useShowKernUX } from "~/components/hooks/useShowKernUX";
import { fetchPage } from "~/services/cms/index.server";

export const loader = async () => {
  const { pageMeta, ...props } = await fetchPage("/");
  return { ...props, meta: pageMeta };
};

export default function Index() {
  const { content } = useLoaderData<typeof loader>();
  const showKernUX = useShowKernUX();
  return <ContentComponents content={content} showKernUX={showKernUX} />;
}
