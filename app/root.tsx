import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "~/styles.css";
import fontsStylesheet from "@digitalservice4germany/angie/fonts.css";
import angieStylesheet from "@digitalservice4germany/angie/angie.css";
import { withSentry } from "@sentry/remix";
import { getWebConfig } from "~/services/config";
import cms from "~/services/cms";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: fontsStylesheet },
  { rel: "stylesheet", href: angieStylesheet },
  {
    rel: "stylesheet",
    href: stylesheet,
  },
];

export const loader: LoaderFunction = async ({ params }) => {
  const footer = await cms().getPage("footer");
  const navigation = await cms().getPage("navigation");

  return json({
    footer: footer,
    navigation: navigation,
  });
};

function App() {
  const content = useLoaderData();

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
        <Navbar {...content.navigation} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Footer {...content.footer} />
      </body>
    </html>
  );
}

export default withSentry(App);
