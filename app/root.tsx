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
  useRouteError,
} from "@remix-run/react";
import stylesheet from "~/styles.css";
import fontsStylesheet from "@digitalservice4germany/angie/fonts.css";
import { withSentry } from "@sentry/remix";
import { PostHog } from "posthog-node";
import { config as configWeb } from "~/services/env/web";
import { config as configServer } from "~/services/env/env.server";
import { getStrapiFooter } from "~/services/cms";
import { getFooterProps } from "~/services/props/getFooterProps";
import Footer from "./components/Footer";
import Breadcrumbs, { breadcrumbsFromURL } from "./components/Breadcrumbs";
import Header from "./components/PageHeader";
import { hasTrackingConsent } from "~/services/analytics/gdprCookie.server";
import { CookieBanner } from "./services/analytics/Analytics";
import ErrorBox from "./components/ErrorBox";
import errorMessage from "./util/errorMessage";
import { createCSRFToken } from "./services/security/csrf.server";
import { commitSession, getSession, sessionAvailable } from "./sessions";
import { CSRFKey } from "./services/security/csrf";

export const headers: HeadersFunction = () => ({
  "Content-Security-Policy": `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src ${
    configServer().TRUSTED_CSP_CONNECT_SOURCES
  };  img-src 'self' ${configServer().TRUSTED_IMAGE_SOURCES}`,
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
  { rel: "stylesheet", href: fontsStylesheet },
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderArgs) => {
  if (configWeb().POSTHOG_API_KEY) {
    const client = new PostHog(configWeb().POSTHOG_API_KEY, {
      host: configWeb().POSTHOG_API_HOST,
    });

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

  const csrf = createCSRFToken();
  let headers = undefined;
  if (sessionAvailable()) {
    const session = await getSession(request.headers.get("Cookie"));
    session.set(CSRFKey, csrf);
    headers = { "Set-Cookie": await commitSession(session) };
  }

  return json(
    {
      [CSRFKey]: csrf,
      breadcrumbs: await breadcrumbsFromURL(request.url),
      footer: getFooterProps(await getStrapiFooter()),
      hasTrackingConsent: await hasTrackingConsent({ request }),
    },
    { headers },
  );
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
