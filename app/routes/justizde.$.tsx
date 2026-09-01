import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import {
  justizDePageAction,
  justizDePageLoader,
} from "~/routes/shared/justizDePageLoader";

export const loader = justizDePageLoader;
export const action = justizDePageAction;

export default function JustizDePage() {
  const { content } = useLoaderData<typeof loader>();
  return <ContentComponents content={content} />;
}
