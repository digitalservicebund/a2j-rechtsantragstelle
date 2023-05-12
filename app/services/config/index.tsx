export interface config {
  STRAPI_API: string;
  STRAPI_HOST: string;
  STRAPI_ACCESS_KEY: string;
  CMS: string;
  ENV: string;
  SENTRY_DSN: string;
  CONTENT_FILE_PATH: string;
}

export interface webConfig {
  SENTRY_DSN: string;
}

let instance: config | undefined = undefined;

export function getWebConfig(): webConfig {
  return {
    SENTRY_DSN:
      typeof window !== "undefined"
        ? (window as any)?.ENV.SENTRY_DSN?.trim()
        : get().SENTRY_DSN?.trim(),
  };
}
export default function get(): config {
  if (instance === undefined) {
    instance = {
      STRAPI_API:
        process.env.STRAPI_API?.trim() ||
        (process.env.STRAPI_HOST?.trim() || "") + "/api/",
      STRAPI_HOST:
        process.env.STRAPI_HOST?.trim() ||
        process.env.STRAPI_API?.trim().replace("api/", "") ||
        "",
      STRAPI_ACCESS_KEY: process.env.STRAPI_ACCESS_KEY?.trim() || "",
      CMS: process.env.CMS || "",
      ENV: process.env.NODE_ENV || "development",
      SENTRY_DSN: process.env.SENTRY_DSN?.trim() || "",
      CONTENT_FILE_PATH: process.env.CONTENT_FILE_PATH || "",
    };
  }

  return instance;
}
