import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPageConfig } from "~/services/cms/getPageConfig";
import PageContent from "~/components/PageContent";
import Container from "~/components/Container";

const title = "A2J - Digitale RAST";

export const meta: V2_MetaFunction = () => [
  { title },
  {
    name: "robots",
    content: "noindex",
  },
];

export const loader: LoaderFunction = async ({ params }) => {
  return json(await getPageConfig("landingpage"));
};

export const indexLinks = [
  { url: "/vorabcheck", displayName: "Vorabcheck" },
  { url: "/flowchart", displayName: "Flowchart" },
  { url: "/kitchensink", displayName: "Kitchensink" },
  { url: "/form-validation-example", displayName: "Form Validation Example" },
  { url: "/strapi-example", displayName: "Strapi Integration Example" },
] as const;

export default function Index() {
  const content = useLoaderData().content;

  return (
    <>
      <PageContent content={content} />
      <Container>
        <h1>{title}</h1>
        <ul>
          {indexLinks.map((link) => (
            <li key={link.url}>
              <Link to={link.url}>{link.displayName}</Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
