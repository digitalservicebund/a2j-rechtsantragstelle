import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import stylesheet from "~/styles.css";
import fontsStylesheet from "@digitalservice4germany/angie/fonts.css";
import { withSentry } from "@sentry/remix";
import { getWebConfig } from "~/services/config";
import { getStrapiFooter } from "~/services/cms";
import { getFooterProps } from "~/services/props/getFooterProps";
import Footer from "./components/Footer";
import Breadcrumbs, { breadcrumbsFromURL } from "./components/Breadcrumbs";
import Header from "./components/PageHeader";
import { hasTrackingConsent } from "~/services/analytics/gdprCookie.server";
import { Analytics } from "./services/analytics/Analytics";
import ErrorBox from "./components/ErrorBox";
import errorMessage from "./util/errorMessage";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: fontsStylesheet },
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderArgs) =>
  json({
    breadcrumbs: await breadcrumbsFromURL(request.url),
    footer: getFooterProps(await getStrapiFooter()),
    hasTrackingConsent: await hasTrackingConsent({ request }),
  });

function App() {
  const { footer, hasTrackingConsent, breadcrumbs } =
    useLoaderData<typeof loader>();

  return (
    <html lang="de" className="scroll-smooth">
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
        <Header />
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer {...footer} />
        <Analytics hasTrackingConsent={hasTrackingConsent} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <main className="flex-grow">
          <ErrorBox errorMessage={errorMessage(useRouteError())} />
        </main>
        <Scripts />
      </body>
    </html>
  );
}
export default withSentry(App);
