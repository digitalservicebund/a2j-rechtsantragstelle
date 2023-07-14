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
import { createCSRFSession } from "./services/security/csrf.server";
import { commitSession } from "./sessions";

export const headers: HeadersFunction = () => ({
  // "Content-Security-Policy": "TODO",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=(), clipboard-read=(), clipboard-write=(), gamepad=(), speaker-selection=(), conversion-measurement=(), focus-without-user-activation=(), hid=(), idle-detection=(), interest-cohort=(), serial=(), sync-script=(), trust-token-redemption=(), unload=(), window-placement=(), vertical-scroll=()",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: fontsStylesheet },
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderArgs) => {
  const { csrf, session } = await createCSRFSession(request);

  if (getWebConfig().POSTHOG_API_KEY) {
    const client = new PostHog(getWebConfig().POSTHOG_API_KEY, {
      host: getWebConfig().POSTHOG_API_HOST,
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
  return json(
    {
      csrf,
      breadcrumbs: await breadcrumbsFromURL(request.url),
      footer: getFooterProps(await getStrapiFooter()),
      hasTrackingConsent: await hasTrackingConsent({ request }),
    },
    { headers: { "Set-Cookie": await commitSession(session) } },
  );
};

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
