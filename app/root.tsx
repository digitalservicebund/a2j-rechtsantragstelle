import BundesSansWebBold from "@digitalservice4germany/angie/fonts/BundesSansWeb-Bold.woff2?url";
import BundesSansWeb from "@digitalservice4germany/angie/fonts/BundesSansWeb-Regular.woff2?url";
import fonts from "@digitalservice4germany/angie/fonts.css?url";
import * as Sentry from "@sentry/react-router";
import { useEffect } from "react";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "react-router";
import {
  data,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteLoaderData,
  Outlet,
  useLocation,
} from "react-router";
import { SkipToContentLink } from "~/components/navigation/SkipToContentLink";
import { flowIdFromPathname } from "~/domains/flowIds";
import { trackingCookieValue } from "~/services/analytics/gdprCookie.server";
import { AnalyticsContext } from "~/services/analytics/useAnalytics";
import {
  fetchMeta,
  fetchSingleEntry,
  fetchTranslations,
} from "~/services/cms/index.server";
import { defaultLocale } from "~/services/cms/models/StrapiLocale";
import { config as configPublic } from "~/services/env/public";
import { parseAndSanitizeMarkdown } from "~/services/security/markdownUtilities";
import { translations as staticTranslations } from "~/services/translations/translations";
import styles from "~/styles.css?url";
import type { Route } from "./+types/root";
import Breadcrumbs from "./components/Breadcrumbs";
import { CookieBanner } from "./components/cookieBanner/CookieBanner";
import Footer from "./components/Footer";
import { useShouldPrint } from "./components/hooks/useShouldPrint";
import PageHeader from "./components/PageHeader";
import { useInitPosthog } from "./services/analytics/useInitPosthog";
import { ErrorBox } from "./services/errorPages/ErrorBox";
import { getFeedbackData } from "./services/feedback/getFeedbackData";
import { buildBreadcrumbPromises } from "./services/meta/breadcrumbs";
import { generatePrintTitle } from "./services/meta/generatePrintTitle";
import { metaFromMatches } from "./services/meta/metaFromMatches";
import { useNonce } from "./services/security/nonce";
import { mainSessionFromCookieHeader } from "./services/session.server";
import { anyUserData } from "./services/session.server/anyUserData.server";
import { getTranslationByKey } from "./services/translations/getTranslationByKey";
import { shouldSetCacheControlHeader } from "./util/shouldSetCacheControlHeader";

export { headers } from "./rootHeaders";

const SKIP_TO_CONTENT_TRANSLATION_KEY = "skip-to-content";

const consoleMessage = `Note: Your browser console might be reporting several errors with the Permission-Policy header.
We are actively disabling all permissions as recommended by https://owasp.org/www-project-secure-headers/#div-bestpractices

Interested in working with us? Reach out https://digitalservice.bund.de/en/career`;

export const links: LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
  { rel: "manifest", href: "/site.webmanifest" },
  { rel: "preload", href: BundesSansWeb, as: "font", crossOrigin: "anonymous" },
  {
    rel: "preload",
    href: BundesSansWebBold,
    as: "font",
    crossOrigin: "anonymous",
  },
  { rel: "preload", href: styles, as: "style" },
  { rel: "stylesheet", href: styles },
  { rel: "preload", href: fonts, as: "style" }, // font css file from angie package
  { rel: "stylesheet", href: fonts },
];

export const meta: MetaFunction<RootLoader> = () => {
  return [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://service.justiz.de/og-image.png" },
  ];
};

export type RootLoader = typeof loader;

const STRAPI_P_LEVEL_TWO = 2;
const STRAPI_P_LEVEL_THREE = 3;

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");

  const [
    strapiHeader,
    strapiFooter,
    cookieBannerContent,
    trackingConsent,
    meta,
    accessibilityTranslations,
    hasAnyUserData,
    mainSession,
    breadcrumbs,
  ] = await Promise.all([
    fetchSingleEntry("page-header", defaultLocale, STRAPI_P_LEVEL_TWO),
    fetchSingleEntry("footer", defaultLocale, STRAPI_P_LEVEL_THREE),
    fetchSingleEntry("cookie-banner", defaultLocale, STRAPI_P_LEVEL_THREE),
    trackingCookieValue({ request }),
    fetchMeta({ filterValue: "/" }),
    fetchTranslations("accessibility"),
    anyUserData(request),
    mainSessionFromCookieHeader(cookieHeader),
    buildBreadcrumbPromises(pathname),
  ]);

  const shouldAddCacheControl = shouldSetCacheControlHeader(
    pathname,
    trackingConsent,
  );
  const flowIdMaybe = flowIdFromPathname(pathname);
  return data(
    {
      breadcrumbs,
      pageHeaderProps: {
        ...strapiHeader,
        hideLinks: Boolean(flowIdMaybe),
        alignToMainContainer: !flowIdMaybe?.match(/formular|antrag/),
      },
      footer: strapiFooter,
      cookieBannerContent: cookieBannerContent,
      hasTrackingConsent: trackingConsent
        ? trackingConsent === "true"
        : undefined,
      meta,
      context,
      hasAnyUserData,
      accessibilityTranslations,
      feedback: getFeedbackData(mainSession, pathname),
      skipContentLinkTarget: flowIdMaybe ? "#flow-page-content" : "#main",
      postSubmissionText: parseAndSanitizeMarkdown(
        staticTranslations.feedback["text-post-submission"].de,
      ),
    },
    { headers: { shouldAddCacheControl: String(shouldAddCacheControl) } },
  );
};

function App() {
  const {
    pageHeaderProps,
    footer,
    cookieBannerContent,
    hasTrackingConsent,
    hasAnyUserData,
    accessibilityTranslations,
    breadcrumbs,
    skipContentLinkTarget,
  } = useLoaderData<RootLoader>();
  const shouldPrint = useShouldPrint();
  const { pathname } = useLocation();
  const matches = useMatches();
  const { title, ogTitle, description } = metaFromMatches(matches);
  const nonce = useNonce();
  const posthogClient = useInitPosthog(hasTrackingConsent);

  // eslint-disable-next-line no-console
  if (typeof window !== "undefined") console.log(consoleMessage);

  useEffect(() => {
    if (shouldPrint) {
      window.print();
      window.close();
    }
  }, [shouldPrint]);

  return (
    <html lang="de">
      <head>
        <title>
          {shouldPrint ? generatePrintTitle(title, pathname) : title}
        </title>
        {description && <meta name="description" content={description} />}
        <meta property="og:title" content={ogTitle ?? title} />
        <meta property="og:description" content={description} />
        <meta
          name="darkreader-lock"
          content="1e82dc17-d02f-4566-8487-ae413a504055"
        />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(configPublic())}`,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col">
        <AnalyticsContext value={{ posthogClient, hasTrackingConsent }}>
          <div className="flex flex-col min-h-screen">
            <CookieBanner content={cookieBannerContent} />
            <SkipToContentLink
              label={getTranslationByKey(
                SKIP_TO_CONTENT_TRANSLATION_KEY,
                accessibilityTranslations,
              )}
              target={skipContentLinkTarget}
            />
            <PageHeader {...pageHeaderProps} />
            <Breadcrumbs
              breadcrumbs={breadcrumbs}
              alignToMainContainer={pageHeaderProps.alignToMainContainer}
              linkLabel={pageHeaderProps.linkLabel}
              ariaLabel={getTranslationByKey(
                "header-breadcrumb",
                accessibilityTranslations,
              )}
            />
            <main className="grow flex" id="main">
              <Outlet />
            </main>
          </div>
          <footer>
            <Footer
              {...footer}
              showDeletionBanner={hasAnyUserData}
              ariaLabel={getTranslationByKey(
                "footer-navigation",
                accessibilityTranslations,
              )}
            />
          </footer>
          <ScrollRestoration nonce={nonce} />
          <Scripts nonce={nonce} />
        </AnalyticsContext>
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: Readonly<Route.ErrorBoundaryProps>) {
  const loaderData = useRouteLoaderData<RootLoader>("root");

  if (error && error instanceof Error) {
    Sentry.captureException(error);
  }

  return (
    <html lang="de">
      <head>
        <title>Justiz Services - Fehler aufgetreten</title>
        <Meta />
        <Links />
        <meta name="darkreader-lock" />
      </head>
      <body className="flex flex-col">
        <div className="min-h-screen">
          <PageHeader
            alignToMainContainer
            hideLinks={false}
            linkLabel="Zurück zur Startseite"
            title="Justiz-Services"
          />
          <main className="grow">
            <ErrorBox context={loaderData?.context ?? {}} />
          </main>
        </div>
        {loaderData && (
          <Footer
            {...loaderData.footer}
            ariaLabel={getTranslationByKey(
              "footer-navigation",
              loaderData.accessibilityTranslations,
            )}
          />
        )}
      </body>
    </html>
  );
}
export default App;
