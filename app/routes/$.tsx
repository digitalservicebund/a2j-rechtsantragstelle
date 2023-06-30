import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import PageContent from "~/components/PageContent";
import { strapiPageFromRequest } from "~/services/cms";
export { ErrorBoundary } from "./shared.step";

export const meta: V2_MetaFunction<typeof loader> = ({ data, location }) => [
  { title: data?.meta.title ?? location.pathname },
];

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const { content, meta } = await strapiPageFromRequest({ request });
    return json({ content, meta });
  } catch (error) {
    if ((error as Error).name === "StrapiPageNotFound") {
      throw new Response(null, {
        status: 404,
        statusText: "Not Found",
      });
    }
    throw error;
  }
};

export default function Index() {
  return <PageContent content={useLoaderData<typeof loader>().content} />;
}
