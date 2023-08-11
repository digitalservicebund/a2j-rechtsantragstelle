import type {
  HeadersFunction,
  LinksFunction,
  LoaderArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import stylesheet from "~/styles.css";
import fontsStylesheet from "@digitalservice4germany/angie/fonts.css";
import fontRegular from "~/../public/fonts/BundesSansWeb-Regular.woff2";
import fontBold from "~/../public/fonts/BundesSansWeb-Bold.woff2";
import { withSentry } from "@sentry/remix";
import { PostHog } from "posthog-node";
import { config as configWeb } from "~/services/env/web";
import { config as configServer } from "~/services/env/env.server";
import { getStrapiFooter } from "~/services/cms/index.server";
import { getFooterProps } from "~/services/props/getFooterProps";
import Footer from "./components/Footer";
import Breadcrumbs, { breadcrumbsFromURL } from "./components/Breadcrumbs";
import Header from "./components/PageHeader";
import { hasTrackingConsent } from "~/services/analytics/gdprCookie.server";
import { CookieBanner } from "./services/analytics/Analytics";
import { ErrorBox, getErrorPages } from "./services/errorPages";

export const headers: HeadersFunction = () => ({
  "Content-Security-Policy": `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src ${
    configServer().TRUSTED_CSP_CONNECT_SOURCES
  };  img-src 'self' localhost:* ${configServer().TRUSTED_IMAGE_SOURCES}`,
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "accelerometer=(),ambient-light-sensor=(),autoplay=(),battery=(),camera=(),display-capture=(),document-domain=(),encrypted-media=(),fullscreen=(),gamepad=(),geolocation=(),gyroscope=(),layout-animations=(self),legacy-image-formats=(self),magnetometer=(),microphone=(),midi=(),oversized-images=(self),payment=(),picture-in-picture=(),publickey-credentials-get=(),speaker-selection=(),sync-xhr=(self),unoptimized-images=(self),unsized-media=(self),usb=(),screen-wake-lock=(),web-share=(),xr-spatial-tracking=()",
});

const consoleMessage = `Note: Your browser console might be reporting several errors with the Permission-Policy header.
We are actively disabling all permissions as recommended by https://owasp.org/www-project-secure-headers/#div-bestpractices

Interested in working with us? Reach out https://digitalservice.bund.de/en/career`;

export const links: LinksFunction = () => [
  {
    rel: "preload",
    as: "font",
    type: "font/woff2",
    href: fontRegular,
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    type: "font/woff2",
    href: fontBold,
    crossOrigin: "anonymous",
  },
  { rel: "stylesheet", href: fontsStylesheet },
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderArgs) => {
  const { POSTHOG_API_KEY, POSTHOG_API_HOST } = configWeb();
  if (POSTHOG_API_KEY) {
    const client = new PostHog(POSTHOG_API_KEY, { host: POSTHOG_API_HOST });

    if (
      request.url.includes("geld-einklagen") &&
      (await client.isFeatureEnabled("hideOVFlow", "backend"))
    ) {
      throw new Response(null, {
        status: 404,
        statusText: "Seite konnte nicht gefunden werden",
      });
    }
  }

  return json({
    breadcrumbs: await breadcrumbsFromURL(request.url),
    footer: getFooterProps(await getStrapiFooter()),
    hasTrackingConsent: await hasTrackingConsent({ request }),
    errorPages: await getErrorPages(),
  });
};

function App() {
  const { footer, hasTrackingConsent, breadcrumbs } =
    useLoaderData<typeof loader>();

  if (typeof window !== "undefined") console.log(consoleMessage);

  return (
    <html lang="de" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(configWeb())}`,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen">
        <CookieBanner hasTrackingConsent={hasTrackingConsent} />
        <Header />
        <Breadcrumbs breadcrumbs={breadcrumbs} />
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

export function ErrorBoundary() {
  const loaderData = useRouteLoaderData<typeof loader>("root");
  return (
    <html>
      <head>
        <title>Justiz Services - Fehler aufgetreten</title>
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <ErrorBox errorPages={loaderData?.errorPages} />
        </main>
        {loaderData && <Footer {...loaderData.footer} />}
      </body>
    </html>
  );
}
export default withSentry(App);
