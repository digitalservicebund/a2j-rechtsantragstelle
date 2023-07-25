interface Config {
  STRAPI_API: string;
  STRAPI_HOST: string;
  STRAPI_ACCESS_KEY: string;
  CMS: string;
  TRUSTED_IMAGE_SOURCES: string;
  TRUSTED_CSP_CONNECT_SOURCES: string;
  REDIS_URL: string;
}

let instance: Config | undefined = undefined;

export function config(): Config {
  if (instance === undefined) {
    const STRAPI_API = process.env.STRAPI_API?.trim();
    const STRAPI_HOST = process.env.STRAPI_HOST?.trim();

    instance = {
      STRAPI_API: STRAPI_API ?? `${STRAPI_HOST}/api/`,
      STRAPI_HOST: STRAPI_HOST ?? STRAPI_API?.replace("api/", "") ?? "",
      STRAPI_ACCESS_KEY: process.env.STRAPI_ACCESS_KEY?.trim() ?? "",
      CMS: process.env.CMS?.trim() ?? "FILE",
      TRUSTED_IMAGE_SOURCES:
        "https://a2j-rechtsantragstelle-infra-public-assets-bucket.obs.eu-de.otc.t-systems.com https://mermaid.ink",
      TRUSTED_CSP_CONNECT_SOURCES:
        process.env.NODE_ENV === "development"
          ? "*"
          : "'self' https://*.ingest.sentry.io https://eu.posthog.com",
      REDIS_URL: process.env.REDIS_URL?.trim() ?? "",
    };
  }

  return instance;
}
