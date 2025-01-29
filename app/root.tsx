import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteLoaderData,
  useRouteError,
  Outlet,
} from "@remix-run/react";
import "~/styles.css";
import "@digitalservice4germany/angie/fonts.css";
import { captureRemixErrorBoundaryError, withSentry } from "@sentry/remix";
import { useEffect, useMemo, useState } from "react";
import { CookieConsentContext } from "~/components/cookieBanner/CookieConsentContext";
import { SkipToContentLink } from "~/components/navigation/SkipToContentLink";
import { flowIdFromPathname } from "~/domains/flowIds";
import { trackingCookieValue } from "~/services/analytics/gdprCookie.server";
import {
  fetchMeta,
  fetchSingleEntry,
  fetchErrors,
  fetchMultipleTranslations,
} from "~/services/cms/index.server";
import { defaultLocale } from "~/services/cms/models/StrapiLocale";
import { config as configWeb } from "~/services/env/web";
import { isFeatureFlagEnabled } from "~/services/featureFlags";
import Breadcrumbs from "./components/Breadcrumbs";
import { CookieBanner } from "./components/cookieBanner/CookieBanner";
import Footer from "./components/Footer";
import Header from "./components/PageHeader";
import { BannerState } from "./components/userFeedback";
import { getCookieBannerProps } from "./services/cms/models/StrapiCookieBannerSchema";
import { getFooterProps } from "./services/cms/models/StrapiFooter";
import { getPageHeaderProps } from "./services/cms/models/StrapiPageHeader";
import { ErrorBox } from "./services/errorPages/ErrorBox";
import { getFeedbackBannerState } from "./services/feedback/getFeedbackBannerState";
import { metaFromMatches } from "./services/meta/metaFromMatches";
import { useNonce } from "./services/security/nonce";
import {
  getSessionManager,
  mainSessionFromCookieHeader,
} from "./services/session.server";
import { anyUserData } from "./services/session.server/anyUserData.server";
import {
  extractTranslations,
  getTranslationByKey,
} from "./services/translations/getTranslationByKey";
import { TranslationContext } from "./services/translations/translationsContext";
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
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css?family=Fira+Sans|Noto+Sans|Roboto",
  },
];

export const meta: MetaFunction<RootLoader> = () => {
  return [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://service.justiz.de/og-image.png" },
  ];
};

const getFeedbackResult = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  const { getSession } = getSessionManager("main");
  const session = await getSession(cookieHeader);
  return session.get("wasHelpful")?.["/hilfe"] ?? null;
};

export type RootLoader = typeof loader;

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");
  const feedbackResult = await getFeedbackResult(request);

  const [
    strapiHeader,
    strapiFooter,
    cookieBannerContent,
    trackingConsent,
    errorPages,
    meta,
    translations,
    hasAnyUserData,
    mainSession,
    showKopfzeile,
  ] = await Promise.all([
    fetchSingleEntry("page-header", defaultLocale),
    fetchSingleEntry("footer", defaultLocale),
    fetchSingleEntry("cookie-banner", defaultLocale),
    trackingCookieValue({ request }),
    fetchErrors(),
    fetchMeta({ filterValue: "/" }),
    fetchMultipleTranslations([
      "delete-data",
      "feedback",
      "pageHeader",
      "video",
      "accessibility",
    ]),
    anyUserData(request),
    mainSessionFromCookieHeader(cookieHeader),
    isFeatureFlagEnabled("showKopfzeile"),
  ]);

  const shouldAddCacheControl = shouldSetCacheControlHeader(
    pathname,
    trackingConsent,
  );

  return json(
    {
      header: {
        ...getPageHeaderProps(strapiHeader),
        hideLinks: flowIdFromPathname(pathname) !== undefined, // no headerlinks on flow pages
        showKopfzeile,
      },
      footer: getFooterProps(strapiFooter),
      cookieBannerContent: cookieBannerContent,
      hasTrackingConsent: trackingConsent
        ? trackingConsent === "true"
        : undefined,
      errorPages,
      meta,
      context,
      deletionLabel: translations["delete-data"].footerLinkLabel,
      hasAnyUserData,
      feedbackTranslations: translations.feedback,
      feedbackResult,
      pageHeaderTranslations: extractTranslations(
        ["leichtesprache", "gebaerdensprache", "mainNavigationAriaLabel"],
        translations.pageHeader,
      ),
      videoTranslations: translations.video,
      accessibilityTranslations: translations.accessibility,
      bannerState:
        getFeedbackBannerState(mainSession, pathname) ?? BannerState.ShowRating,
    },
    { headers: { shouldAddCacheControl: String(shouldAddCacheControl) } },
  );
};

function App() {
  const {
    header,
    footer,
    cookieBannerContent,
    hasTrackingConsent,
    deletionLabel,
    hasAnyUserData,
    feedbackTranslations,
    pageHeaderTranslations,
    videoTranslations,
    accessibilityTranslations,
  } = useLoaderData<RootLoader>();
  const matches = useMatches();
  const { breadcrumbs, title, ogTitle, description } = metaFromMatches(matches);
  const nonce = useNonce();
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

  const translationMemo = useMemo(
    () => ({
      video: videoTranslations,
      feedback: feedbackTranslations,
      accessibility: accessibilityTranslations,
    }),
    [videoTranslations, feedbackTranslations, accessibilityTranslations],
  );

  return (
    <html lang="de">
      <head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <meta property="og:title" content={ogTitle ?? title} />
        <meta property="og:description" content={description} />
        <meta name="darkreader-lock" />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(configWeb())}`,
          }}
        />
        <Meta />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Fira+Sans|Noto+Sans|Roboto"
        ></link>
        <Links />
      </head>
      <body className="flex flex-col min-h-screen">
        <CookieConsentContext.Provider value={hasTrackingConsent}>
          <SkipToContentLink
            label={getTranslationByKey(
              SKIP_TO_CONTENT_TRANSLATION_KEY,
              accessibilityTranslations,
            )}
            target={skipToContentLinkTarget}
          />
          <CookieBanner content={getCookieBannerProps(cookieBannerContent)} />
          <Header {...header} translations={pageHeaderTranslations} />
          <Breadcrumbs breadcrumbs={breadcrumbs} linkLabel={header.linkLabel} />
          <TranslationContext.Provider value={translationMemo}>
            <main className="flex-grow" id="main">
              <Outlet />
            </main>
          </TranslationContext.Provider>
          <footer>
            <Footer
              {...footer}
              deletionLabel={deletionLabel}
              showDeletionBanner={hasAnyUserData}
            />
          </footer>
          <ScrollRestoration nonce={nonce} />
          <Scripts nonce={nonce} />
        </CookieConsentContext.Provider>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const loaderData = useRouteLoaderData<RootLoader>("root");
  captureRemixErrorBoundaryError(useRouteError());
  return (
    <html lang="de">
      <head>
        <title>Justiz Services - Fehler aufgetreten</title>
        <Meta />
        <Links />
        <meta name="darkreader-lock" />
      </head>
      <body className="flex flex-col min-h-screen">
        {loaderData && (
          <Header
            {...loaderData.header}
            translations={loaderData.pageHeaderTranslations}
          />
        )}
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
