import { type LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PageContent from "~/components/PageContent";
import { strapiPageFromRequest } from "~/services/cms/index.server";

export async function loader({ request }: LoaderArgs) {
  const { content, meta } = await strapiPageFromRequest({ request });
  return json({ content, meta });
}

export default function View() {
  return <PageContent content={useLoaderData<typeof loader>().content} />;
}
