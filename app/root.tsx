import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "~/styles.css";
import angieStylesheet from "@digitalservice4germany/angie/angie.css";
import { withSentry } from "@sentry/remix";
import { getWebConfig } from "~/services/config";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: angieStylesheet },
  {
    rel: "stylesheet",
    href: stylesheet,
  },
];

function App() {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(getWebConfig())}`,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default withSentry(App);
