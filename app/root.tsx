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
  useRouteError,
} from "@remix-run/react";
import "~/styles.css";
import "@digitalservice4germany/angie/fonts.css";
import { captureRemixErrorBoundaryError, withSentry } from "@sentry/remix";
import { hasTrackingConsent } from "~/services/analytics/gdprCookie.server";
import {
  fetchMeta,
  fetchSingleEntry,
  fetchErrors,
  fetchTranslations,
} from "~/services/cms/index.server";
import { config as configWeb } from "~/services/env/web";
import Breadcrumbs from "./components/Breadcrumbs";
import { CookieBanner } from "./components/CookieBanner";
import FeedbackBanner, { augmentFeedback } from "./components/FeedbackBanner";
import Footer from "./components/Footer";
import Header from "./components/PageHeader";
import { FeedbackTranslationContext } from "./components/UserFeedback/FeedbackTranslationContext";
import { getCookieBannerProps } from "./services/cms/models/StrapiCookieBannerSchema";
import { getFooterProps } from "./services/cms/models/StrapiFooter";
import { getStrapiFeedback } from "./services/cms/models/StrapiGlobal";
import { getPageHeaderProps } from "./services/cms/models/StrapiPageHeader";
import { ErrorBox } from "./services/errorPages/ErrorBox";
import { metaFromMatches } from "./services/meta/metaFromMatches";
import { useNonce } from "./services/security/nonce";
import { anyUserData } from "./services/session.server/anyUserData.server";

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
    deleteDataStrings,
    hasAnyUserData,
    feedbackTranslations,
  ] = await Promise.all([
    fetchSingleEntry("page-header"),
    fetchSingleEntry("global"),
    fetchSingleEntry("footer"),
    fetchSingleEntry("cookie-banner"),
    hasTrackingConsent({ request }),
    fetchErrors(),
    fetchMeta({ filterValue: "/" }),
    fetchTranslations("delete-data"),
    anyUserData(request),
    fetchTranslations("feedback"),
  ]);

  return json({
    feedback: getStrapiFeedback(globalVars),
    header: getPageHeaderProps(strapiHeader),
    footer: getFooterProps(strapiFooter),
    cookieBannerContent: cookieBannerContent,
    hasTrackingConsent: trackingConsent,
    errorPages,
    meta,
    context,
    deletionLabel: deleteDataStrings["footerLinkLabel"],
    hasAnyUserData,
    feedbackTranslations,
  });
};

function App() {
  const {
    header,
    footer,
    cookieBannerContent,
    hasTrackingConsent,
    feedback,
    deletionLabel,
    hasAnyUserData,
    feedbackTranslations,
  } = useLoaderData<typeof loader>();
  const { breadcrumbs, title, ogTitle, description } =
    metaFromMatches(useMatches());
  const nonce = useNonce();

  // eslint-disable-next-line no-console
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
        {configWeb().ENVIRONMENT == "preview" && (
          <script
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: `(function (m, a, z, e) {
            var s, t;
            try {
              t = m.sessionStorage.getItem('maze-us');
            } catch (err) {}

            if (!t) {
              t = new Date().getTime();
              try {
                m.sessionStorage.setItem('maze-us', t);
              } catch (err) {}
            }

            s = a.createElement('script');
            s.src = z + '?apiKey=' + e;
            s.async = true;
            a.getElementsByTagName('head')[0].appendChild(s);
            m.mazeUniversalSnippetApiKey = e;
          })(window, document, 'https://snippet.maze.co/maze-universal-loader.js', '69beb286-48a3-46df-b5a4-d7d5014a9ace');`,
            }}
          ></script>
        )}
      </head>
      <body className="flex flex-col min-h-screen">
        <CookieBanner
          hasTrackingConsent={hasTrackingConsent}
          content={getCookieBannerProps(cookieBannerContent)}
        />
        <Header {...header} />
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <FeedbackTranslationContext.Provider
          value={{ translations: feedbackTranslations }}
        >
          <main className="flex-grow">
            <Outlet />
          </main>
        </FeedbackTranslationContext.Provider>
        <footer>
          <FeedbackBanner {...augmentFeedback(feedback, title)} />
          <Footer
            {...footer}
            deletionLabel={deletionLabel}
            showDeletionBanner={hasAnyUserData}
          />
        </footer>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const loaderData = useRouteLoaderData<typeof loader>("root");
  captureRemixErrorBoundaryError(useRouteError());
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
