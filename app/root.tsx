import * as Sentry from "@sentry/react-router";
import type { PostHog } from "posthog-js";
import { useEffect, useState } from "react";
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
} from "react-router";
import "~/styles.css";
import "@digitalservice4germany/angie/fonts.css";
import { SkipToContentLink } from "~/components/navigation/SkipToContentLink";
import { flowIdFromPathname } from "~/domains/flowIds";
import { trackingCookieValue } from "~/services/analytics/gdprCookie.server";
import { AnalyticsContext } from "~/services/analytics/useAnalytics";
import {
  fetchMeta,
  fetchSingleEntry,
  fetchErrors,
  fetchTranslations,
} from "~/services/cms/index.server";
import { defaultLocale } from "~/services/cms/models/StrapiLocale";
import { config as configWeb } from "~/services/env/web";
import { parseAndSanitizeMarkdown } from "~/services/security/markdownUtilities";
import { translations as staticTranslations } from "~/services/translations/translations";
import type { Route } from "./+types/root";
import Breadcrumbs from "./components/Breadcrumbs";
import { CookieBanner } from "./components/cookieBanner/CookieBanner";
import Footer from "./components/Footer";
import PageHeader from "./components/PageHeader";
import { initPosthog } from "./services/analytics/initPosthog";
import { ErrorBox } from "./services/errorPages/ErrorBox";
import { getFeedbackData } from "./services/feedback/getFeedbackData";
import { logError } from "./services/logging";
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

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { pathname, searchParams } = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");

  const shouldPrint = searchParams.get("print") !== null;

  const [
    strapiHeader,
    strapiFooter,
    cookieBannerContent,
    trackingConsent,
    errorPages,
    meta,
    accessibilityTranslations,
    hasAnyUserData,
    mainSession,
  ] = await Promise.all([
    fetchSingleEntry("page-header", defaultLocale),
    fetchSingleEntry("footer", defaultLocale),
    fetchSingleEntry("cookie-banner", defaultLocale),
    trackingCookieValue({ request }),
    fetchErrors(),
    fetchMeta({ filterValue: "/" }),
    fetchTranslations("accessibility"),
    anyUserData(request),
    mainSessionFromCookieHeader(cookieHeader),
  ]);

  const shouldAddCacheControl = shouldSetCacheControlHeader(
    pathname,
    trackingConsent,
  );

  return data(
    {
      pageHeaderProps: {
        ...strapiHeader,
        hideLinks: flowIdFromPathname(pathname) !== undefined, // no headerlinks on flow pages
        alignToMainContainer:
          !flowIdFromPathname(pathname)?.match(/formular|antrag/),
      },
      footer: strapiFooter,
      cookieBannerContent: cookieBannerContent,
      hasTrackingConsent: trackingConsent
        ? trackingConsent === "true"
        : undefined,
      errorPages,
      meta,
      context,
      hasAnyUserData,
      accessibilityTranslations,
      feedback: getFeedbackData(mainSession, pathname),
      postSubmissionText: parseAndSanitizeMarkdown(
        staticTranslations.feedback["text-post-submission"].de,
      ),
      shouldPrint,
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
    shouldPrint,
  } = useLoaderData<RootLoader>();
  const matches = useMatches();
  const { breadcrumbs, title, ogTitle, description } = metaFromMatches(matches);
  const nonce = useNonce();
  const [posthogClient, setPosthogClient] = useState<PostHog | undefined>();
  useEffect(() => {
    initPosthog(hasTrackingConsent)
      .then((client) => {
        setPosthogClient(client);
      })
      .catch(logError);
  });

  const [skipToContentLinkTarget, setSkipToContentLinkTarget] =
    useState("#main");

  // eslint-disable-next-line no-console
  if (typeof window !== "undefined") console.log(consoleMessage);

  /**
   * Need to set focus to inside the form flow for screen reader convenience.
   * Calls to `document` must happen within useEffect, as this hook is never rendered on the server-side
   */
  useEffect(() => {
    if (document.getElementById("form-flow-page-content")) {
      setSkipToContentLinkTarget("#form-flow-page-content");
    }
  }, []);

  useEffect(() => {
    if (shouldPrint) {
      window.print();
      window.close();
    }
  }, [shouldPrint]);

  return (
    <html lang="de">
      <head>
        <title>{title}</title>
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
            __html: `window.ENV = ${JSON.stringify(configWeb())}`,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col">
        <AnalyticsContext value={{ posthogClient, hasTrackingConsent }}>
          <div className="flex flex-col min-h-screen">
            <SkipToContentLink
              label={getTranslationByKey(
                SKIP_TO_CONTENT_TRANSLATION_KEY,
                accessibilityTranslations,
              )}
              target={skipToContentLinkTarget}
            />
            <PageHeader {...pageHeaderProps} />
            <Breadcrumbs
              breadcrumbs={breadcrumbs}
              alignToMainContainer={pageHeaderProps.alignToMainContainer}
              linkLabel={pageHeaderProps.linkLabel}
              translations={{ ...accessibilityTranslations }}
            />
            <main className="flex-grow flex" id="main">
              <Outlet />
            </main>
            <CookieBanner content={cookieBannerContent} />
          </div>
          <footer>
            <Footer
              {...footer}
              showDeletionBanner={hasAnyUserData}
              translations={{ ...accessibilityTranslations }}
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
          <main className="flex-grow">
            <ErrorBox context={loaderData?.context ?? {}} />
          </main>
        </div>
        {loaderData && (
          <Footer
            {...loaderData.footer}
            translations={{ ...loaderData.accessibilityTranslations }}
          />
        )}
      </body>
    </html>
  );
}
export default App;
