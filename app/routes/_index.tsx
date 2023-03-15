import { Link } from "@remix-run/react";

const links = [
  { url: "/types_showcase", displayName: "types showcase" },
  { url: "/kitchensink", displayName: "kitchensink" },
  { url: "/form", displayName: "multi-page form" },
  { url: "/strapi-example", displayName: "strapi-example-page" },
];

export default function Index() {
  return (
    <ul>
      {links.map((link) => {
        return (
          <li key={link.url}>
            <Link to={link.url}>{link.displayName}</Link>
          </li>
        );
      })}
    </ul>
  );
}
