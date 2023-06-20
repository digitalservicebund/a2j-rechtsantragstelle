import type { LinksFunction } from "@remix-run/node";
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
import { withSentry } from "@sentry/remix";
import { getWebConfig } from "~/services/config";
import { getStrapiFooter, getStrapiNavigation } from "~/services/cms";
import { getFooterProps } from "~/services/props/getFooterProps";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { getNavbarProps } from "./services/props/getNavbarProps";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: fontsStylesheet },
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async () =>
  json({
    footer: getFooterProps(await getStrapiFooter()),
    navigation: getNavbarProps(await getStrapiNavigation()),
  });

function App() {
  const { footer, navigation } = useLoaderData<typeof loader>();

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
      <body className="flex flex-col min-h-screen">
        <Navbar {...navigation} />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer {...footer} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default withSentry(App);
