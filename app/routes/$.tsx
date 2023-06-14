import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import PageContent from "~/components/PageContent";
import { getStrapiPage } from "~/services/cms";

export const meta: V2_MetaFunction<typeof loader> = ({ data, location }) => [
  { title: data ? data.meta.title : location.pathname },
];

export const loader: LoaderFunction = async ({ params }) => {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");

  try {
    const page = await getStrapiPage({ slug: splat });

    return json({
      content: page.content,
      meta: page.meta,
    });
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
