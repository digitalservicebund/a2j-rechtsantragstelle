export interface config {
  STRAPI_API: string;
  STRAPI_ACCESS_KEY: string;
  CMS: string;
  ENV: string;
}

export interface webConfig {
  SENTRY_DSN: string;
}

let instance: config | undefined = undefined;
let webInstance: webConfig | undefined = undefined;

export function getWebConfig(): webConfig {
  if (webInstance === undefined) {
    webInstance = {
      SENTRY_DSN:
        typeof window !== "undefined" ? (window as any)?.ENV.SENTRY_DSN : "",
    };
  }
  return webInstance;
}

export default function get(): config {
  if (instance === undefined) {
    instance = {
      // Removing trim because infrastructure adding a newline on secret
      STRAPI_API:
        process.env.STRAPI_API?.trim() ||
        (process.env.STRAPI_HOST?.trim() || "") + "/api/",
      STRAPI_ACCESS_KEY: process.env.STRAPI_ACCESS_KEY?.trim() || "",
      CMS: process.env.CMS || "",
      ENV: process.env.NODE_ENV || "development",
    };
  }

  return instance;
}
