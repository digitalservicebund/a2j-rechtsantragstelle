import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteLoaderData,
} from "@remix-run/react";
import "~/styles.css";
import "@digitalservice4germany/angie/fonts.css";
import { withSentry } from "@sentry/remix";
import { config as configWeb } from "~/services/env/web";
import {
  fetchMeta,
  fetchSingleEntry,
  fetchErrors,
} from "~/services/cms/index.server";
import { getFooterProps } from "./services/cms/models/StrapiFooter";
import Footer from "./components/Footer";
import Breadcrumbs from "./components/Breadcrumbs";
import Header from "./components/PageHeader";
import { hasTrackingConsent } from "~/services/analytics/gdprCookie.server";
import { CookieBanner } from "./services/analytics/Analytics";
import { ErrorBox } from "./services/errorPages/ErrorBox";
import { useNonce } from "./services/security/nonce";
import { metaFromMatches } from "./services/meta/metaFromMatches";
import { getPageHeaderProps } from "./services/cms/models/StrapiPageHeader";
import { getCookieBannerProps } from "./services/cms/models/StrapiCookieBannerSchema";
import FeedbackBanner, { augmentFeedback } from "./components/FeedbackBanner";
import { getStrapiFeedback } from "./services/cms/models/StrapiGlobal";

export const headers: HeadersFunction = () => ({
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
    href: "/fonts/BundesSansWeb-Regular.woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "font",
    type: "font/woff2",
    href: "/fonts/BundesSansWeb-Bold.woff2",
    crossOrigin: "anonymous",
  },
  { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
  { rel: "manifest", href: "/site.webmanifest" },
];

export const meta: MetaFunction<typeof loader> = () => {
  return [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://service.justiz.de/og-image.png" },
  ];
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const [
    strapiHeader,
    globalVars,
    strapiFooter,
    cookieBannerContent,
    trackingConsent,
    errorPages,
    meta,
  ] = await Promise.all([
    fetchSingleEntry("page-header"),
    fetchSingleEntry("global"),
    fetchSingleEntry("footer"),
    fetchSingleEntry("cookie-banner"),
    hasTrackingConsent({ request }),
    fetchErrors(),
    fetchMeta({ filterValue: "/" }),
  ]);

  return json({
    feedback: getStrapiFeedback(globalVars),
    header: getPageHeaderProps(strapiHeader),
    footer: getFooterProps(strapiFooter),
    cookieBannerContent: getCookieBannerProps(cookieBannerContent),
    hasTrackingConsent: trackingConsent,
    errorPages,
    meta,
    context,
  });
};

function App() {
  const { header, footer, cookieBannerContent, hasTrackingConsent, feedback } =
    useLoaderData<typeof loader>();
  const { breadcrumbs, title, ogTitle, description } =
    metaFromMatches(useMatches());
  const nonce = useNonce();

  if (typeof window !== "undefined") console.log(consoleMessage);

  return (
    <html lang="de">
      <head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <meta property="og:title" content={ogTitle ?? title} />
        <meta property="og:description" content={description} />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(configWeb())}`,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen">
        <CookieBanner
          hasTrackingConsent={hasTrackingConsent}
          content={cookieBannerContent}
        />
        <Header {...header} />
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <main className="flex-grow">
          <Outlet />
          <FeedbackBanner {...augmentFeedback(feedback, title)} />
        </main>
        <Footer {...footer} />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const loaderData = useRouteLoaderData<typeof loader>("root");
  return (
    <html lang="de">
      <head>
        <title>Justiz Services - Fehler aufgetreten</title>
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen">
        {loaderData && <Header {...loaderData.header} />}
        <main className="flex-grow">
          <ErrorBox
            errorPages={loaderData?.errorPages}
            context={loaderData?.context ?? {}}
          />
        </main>
        {loaderData && <Footer {...loaderData.footer} />}
      </body>
    </html>
  );
}
export default withSentry(App);
