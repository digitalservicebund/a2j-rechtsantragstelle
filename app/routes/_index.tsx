import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPageConfig } from "~/services/cms/getPageConfig";
import PageContent from "~/components/PageContent";

const title = "A2J - Digitale RAST";

export const meta: V2_MetaFunction = () => [
  { title },
  {
    name: "robots",
    content: "noindex",
  },
];

export default function Index() {
  return <PageContent content={useLoaderData().content} />;
}
