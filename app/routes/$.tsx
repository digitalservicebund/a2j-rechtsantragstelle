import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PageContent from "~/components/PageContent";
import { strapiPageFromRequest } from "~/services/cms/index.server";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagEnabled(request);
  try {
    const { content, meta } = await strapiPageFromRequest({ request });
    return json({ content, meta });
  } catch (error) {
    if ((error as Error).name === "StrapiPageNotFound") {
      throw new Response(null, { status: 404 });
    }
    throw error;
  }
};

export default function Index() {
  return <PageContent content={useLoaderData<typeof loader>().content} />;
}
