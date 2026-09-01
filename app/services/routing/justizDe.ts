// Migrated justiz.de content lives under its own prefix and brings its own
// header and footer, so the root layout and loader skip their work for it.
export const justizDePathPrefix = "/justizde";

export const isJustizDePath = (pathname: string) =>
  pathname.startsWith(justizDePathPrefix);

// justiz.de serves German and English under identical paths (www vs en
// subdomain), so the slug is shared and only the locale prefix differs here.
export const justizDeLocales = ["de", "en"] as const;
export type JustizDeLocale = (typeof justizDeLocales)[number];
export const defaultJustizDeLocale: JustizDeLocale = "de";

const isJustizDeLocale = (value: string): value is JustizDeLocale =>
  (justizDeLocales as readonly string[]).includes(value);

/** "/justizde/en/onlinedienste" => { locale: "en", slug: "/onlinedienste" } */
export function parseJustizDePath(pathname: string): {
  locale: JustizDeLocale;
  slug: string;
} {
  const rest = pathname.slice(justizDePathPrefix.length);
  const [, firstSegment = "", ...remaining] = rest.split("/");

  // The default locale has no prefix, so "/justizde/de/…" is not a valid path
  if (
    firstSegment !== defaultJustizDeLocale &&
    isJustizDeLocale(firstSegment)
  ) {
    return { locale: firstSegment, slug: `/${remaining.join("/")}` };
  }
  return { locale: defaultJustizDeLocale, slug: rest || "/" };
}

export const justizDeHref = (locale: JustizDeLocale, slug: string) =>
  locale === defaultJustizDeLocale
    ? `${justizDePathPrefix}${slug}`
    : `${justizDePathPrefix}/${locale}${slug}`;
