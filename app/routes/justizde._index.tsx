import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import {
  justizDePageAction,
  justizDePageLoader,
} from "~/routes/shared/justizDePageLoader";

// The splat route does not match "/justizde" itself, so the start page needs
// its own index route. Both resolve to the Strapi entry with slug "/".
export const loader = justizDePageLoader;
export const action = justizDePageAction;

export default function JustizDeIndex() {
  const { content } = useLoaderData<typeof loader>();
  return <ContentComponents content={content} />;
}
