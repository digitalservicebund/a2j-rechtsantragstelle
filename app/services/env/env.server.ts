interface Config {
  STRAPI_API: string;
  STRAPI_HOST: string;
  STRAPI_ACCESS_KEY: string;
  CMS: string;
  TRUSTED_IMAGE_SOURCES: string;
  TRUSTED_CSP_CONNECT_SOURCES: string;
  REDIS_ENDPOINT: string;
  REDIS_PASSWORD: string;
  COOKIE_SESSION_SECRET: string;
}

let instance: Config | undefined = undefined;

export function config(): Config {
  if (instance === undefined) {
    const STRAPI_API = process.env.STRAPI_API?.trim();
    const COOKIE_SESSION_SECRET = process.env.COOKIE_SESSION_SECRET?.trim();
    if (!COOKIE_SESSION_SECRET)
      throw new Error("Missing: Cookie Session Secret");

    instance = {
      STRAPI_API: STRAPI_API ?? "",
      STRAPI_HOST: STRAPI_API?.replace("/api/", "") ?? "",
      STRAPI_ACCESS_KEY: process.env.STRAPI_ACCESS_KEY?.trim() ?? "",
      CMS: process.env.CMS?.trim() ?? "FILE",
      TRUSTED_IMAGE_SOURCES:
        "https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com https://mermaid.ink",
      TRUSTED_CSP_CONNECT_SOURCES:
        process.env.NODE_ENV === "development"
          ? "*"
          : "'self' https://*.ingest.sentry.io https://eu.posthog.com",
      REDIS_ENDPOINT: process.env.REDIS_ENDPOINT?.trim() ?? "localhost:6380",
      REDIS_PASSWORD: process.env.REDIS_PASSWORD?.trim() ?? "",
      COOKIE_SESSION_SECRET,
    };
  }

  return instance;
}
