import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import PageContent from "~/components/PageContent";
import { strapiPageFromRequest } from "~/services/cms";

export const meta: V2_MetaFunction<typeof loader> = ({ data, location }) => [
  { title: data?.meta.title ?? location.pathname },
];

export const loader = async ({ request }: LoaderArgs) => {
  const { content, meta } = await strapiPageFromRequest({ request });
  return json({ content, meta });
};

export default function Index() {
  return <PageContent content={useLoaderData<typeof loader>().content} />;
}
