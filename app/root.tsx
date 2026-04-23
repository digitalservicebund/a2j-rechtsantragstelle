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
  Outlet,
  useLocation,
  useRouteLoaderData,
} from "react-router";
import { flowIdFromPathname } from "~/domains/flowIds";
import { AnalyticsContext } from "~/services/analytics/useAnalytics";
import {
  fetchContentPageMeta,
  fetchSingleEntry,
  fetchTranslations,
} from "~/services/cms/index.server";
import { defaultLocale } from "~/services/cms/models/StrapiLocale";
import { config as configPublic } from "~/services/env/public";
import { parseAndSanitizeMarkdown } from "~/services/security/markdownUtilities";
import { translations as staticTranslations } from "~/services/translations/translations";
import styles from "~/styles.kern.css?url";
import type { Route } from "./+types/root";
import { useShouldPrint } from "./components/hooks/useShouldPrint";
import { useInitPosthog } from "./services/analytics/useInitPosthog";
import { ErrorBox } from "./services/errorPages/ErrorBox";
import { buildBreadcrumbPromises } from "./services/meta/breadcrumbs";
import { generatePrintTitle } from "./services/meta/generatePrintTitle";
import { metaFromMatches } from "./services/meta/metaFromMatches";
import { useNonce } from "./services/security/nonce";
import { initializeMainSession } from "./services/session.server";
import { anyUserData } from "./services/session.server/anyUserData.server";
import { getTranslationByKey } from "./services/translations/getTranslationByKey";
import { KernCookieBanner } from "./components/kern/KernCookieBanner";
import KernFooter from "./components/kern/layout/footer/KernFooter";
import KernBreadcrumbs from "./components/kern/layout/KernBreadcrumbs";
import KernPageHeader from "./components/kern/layout/KernPageHeader";
import { KernSkipToContentLink } from "./components/kern/navigation/SkipToContentLink";

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

  const [
    strapiHeader,
    cookieBannerContent,
    meta,
    accessibilityTranslations,
    hasAnyUserData,
    { headers, feedback, csrf, trackingConsent },
    breadcrumbs,
  ] = await Promise.all([
    fetchSingleEntry("page-header", defaultLocale, STRAPI_P_LEVEL_TWO),
    fetchSingleEntry("cookie-banner", defaultLocale, STRAPI_P_LEVEL_THREE),
    fetchContentPageMeta({ filterValue: "/", locale: defaultLocale }),
    fetchTranslations("accessibility"),
    anyUserData(request),
    initializeMainSession(request),
    buildBreadcrumbPromises(pathname),
  ]);

  const isAnyFlowPage = Boolean(flowIdFromPathname(pathname));
  return data(
    {
      breadcrumbs,
      pageHeaderProps: { ...strapiHeader, hideLinks: isAnyFlowPage },
      cookieBannerContent: cookieBannerContent,
      hasTrackingConsent: trackingConsent
        ? trackingConsent === "true"
        : undefined,
      meta,
      context,
      hasAnyUserData,
      accessibilityTranslations,
      feedback,
      skipContentLinkTarget: isAnyFlowPage ? "#flow-page-content" : "#main",
      postSubmissionText: parseAndSanitizeMarkdown(
        staticTranslations.feedback["text-post-submission"].de,
      ),
      csrf,
    },
    {
      headers,
    },
  );
};

// Don't accept any mutations on content routes. This safely catches bot POST/PUT spam without crashing or alerting Sentry
export const action = async () =>
  new Response("Method Not Allowed", { status: 405 });

function App() {
  const {
    pageHeaderProps,
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
  const isHomepage = pathname === "/";

  // oxlint-disable-next-line no-console
  if (globalThis.window != undefined) console.log(consoleMessage);

  useEffect(() => {
    if (shouldPrint) {
      globalThis.window.print();
      globalThis.window.close();
    }
  }, [shouldPrint]);

  return (
    <html lang="de" {...{ "data-kern-theme": "light" }}>
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
        {isHomepage && (
          <meta
            name="google-site-verification"
            content="FiIRxI-2p2xlxiXU2sfkQnMJGfFcsrULQr21f-JQxGA"
          />
        )}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(configPublic())}`,
          }}
        />
        <link rel="stylesheet" href={styles} />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen grid grid-rows-[auto_auto_1fr_auto]">
        <AnalyticsContext value={{ posthogClient, hasTrackingConsent }}>
          <KernCookieBanner content={cookieBannerContent} />
          <KernSkipToContentLink
            label={getTranslationByKey(
              SKIP_TO_CONTENT_TRANSLATION_KEY,
              accessibilityTranslations,
            )}
            target={skipContentLinkTarget}
          />
          <KernPageHeader {...pageHeaderProps} />
          <KernBreadcrumbs
            breadcrumbs={breadcrumbs}
            linkLabel={pageHeaderProps.linkLabel}
            ariaLabel={getTranslationByKey(
              "header-breadcrumb",
              accessibilityTranslations,
            )}
          />
          <main className="min-h-0 overflow-auto" id="main">
            <Outlet />
          </main>
          <footer>
            <KernFooter
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
  const accessibilityTranslations = loaderData?.accessibilityTranslations ?? {};

  if (error && error instanceof Error) {
    Sentry.captureException(error);
  }

  return (
    <html lang="de" {...{ "data-kern-theme": "light" }}>
      <head>
        <title>Justiz Services - Fehler aufgetreten</title>
        <link rel="stylesheet" href={styles} />
        <Meta />
        <Links />
        <meta name="darkreader-lock" />
      </head>
      <body className="min-h-screen grid grid-rows-[auto_auto_1fr_auto]">
        <KernPageHeader
          hideLinks={false}
          linkLabel="Zurück zur Startseite"
          title="Justiz-Services"
        />
        <main className="bg-kern-neutral-025">
          <ErrorBox />
        </main>
        <KernFooter
          ariaLabel={getTranslationByKey(
            "footer-navigation",
            accessibilityTranslations,
          )}
        />
      </body>
    </html>
  );
}
export default App;
