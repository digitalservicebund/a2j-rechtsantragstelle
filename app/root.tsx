import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
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
  useMatches,
  useRouteLoaderData,
} from "@remix-run/react";
import stylesheet from "~/styles.css";
import fontsStylesheet from "@digitalservice4germany/angie/fonts.css";
import fontRegular from "~/../public/fonts/BundesSansWeb-Regular.woff2";
import fontBold from "~/../public/fonts/BundesSansWeb-Bold.woff2";
import ogImage from "~/../public/og-image.png";
import { withSentry } from "@sentry/remix";
import { config as configWeb } from "~/services/env/web";
import { fetchMeta, fetchSingleEntry } from "~/services/cms/index.server";
import { getFooterProps } from "./services/cms/models/StrapiFooter";
import Footer from "./components/Footer";
import Breadcrumbs from "./components/Breadcrumbs";
import Header from "./components/PageHeader";
import { hasTrackingConsent } from "~/services/analytics/gdprCookie.server";
import { CookieBanner } from "./services/analytics/Analytics";
import { ErrorBox, getErrorPages } from "./services/errorPages";
import { useNonce } from "./services/security/nonce";
import { metaFromMatches } from "./services/metaFromMatches";
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
    { property: "og:image", content: `https://service.justiz.de${ogImage}` },
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
    getErrorPages(),
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
    ip:
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-client-ip") ??
      "unknown",
  });
};

function App() {
  const {
    header,
    footer,
    cookieBannerContent,
    hasTrackingConsent,
    feedback,
    ip,
  } = useLoaderData<typeof loader>();
  const { breadcrumbs, title, ogTitle, description } =
    metaFromMatches(useMatches());
  const nonce = useNonce();

  if (typeof window !== "undefined") console.log(consoleMessage);

  return (
    <html lang="de" className="scroll-smooth">
      <head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <meta property="og:title" content={ogTitle ?? title} />
        <meta property="og:description" content={description} />
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
          ${JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Justiz-Services",
            url: "https://service.justiz.de/",
          })}`,
          }}
        />
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
          ip={ip}
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
        <LiveReload nonce={nonce} />
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
