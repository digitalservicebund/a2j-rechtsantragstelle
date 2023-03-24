import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

const title = "A2J - Digitale RAST";

export const meta: V2_MetaFunction = () => [
  { title },
  {
    name: "robots",
    content: "noindex",
  },
];

export const indexLinks = [
  { url: "/vorabcheck", displayName: "Vorabcheck" },
  { url: "/flowchart", displayName: "Flowchart" },
  { url: "/kitchensink", displayName: "Kitchensink" },
  { url: "/form-validation-example", displayName: "Form Validation Example" },
  { url: "/strapi-example", displayName: "Strapi Integration Example" },
] as const;

export default function Index() {
  return (
    <>
      <h1>{title}</h1>
      <ul>
        {indexLinks.map((link) => (
          <li key={link.url}>
            <Link to={link.url}>{link.displayName}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
