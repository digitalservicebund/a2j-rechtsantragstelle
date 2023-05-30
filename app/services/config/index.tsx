export interface config {
  STRAPI_API: string;
  STRAPI_HOST: string;
  STRAPI_ACCESS_KEY: string;
  CMS: string;
}

export interface webConfig {
  SENTRY_DSN: string;
  ENVIRONMENT: string;
}

let instance: config | undefined = undefined;

const getNodeOrWebEnv = () =>
  typeof window !== "undefined" ? (window as any)?.ENV : process.env;

export function getWebConfig(): webConfig {
  return {
    SENTRY_DSN: getNodeOrWebEnv().SENTRY_DSN?.trim() || "",
    ENVIRONMENT: getNodeOrWebEnv().ENVIRONMENT || "local",
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
      CMS: process.env.CMS || "FILE",
    };
  }

  return instance;
}
