export interface Config {
  STRAPI_API: string;
  STRAPI_HOST: string;
  STRAPI_ACCESS_KEY: string;
  CMS: string;
}

let instance: Config | undefined = undefined;

const getNodeOrWebEnv = (): Record<string, string> =>
  typeof window !== "undefined" ? (window as any)?.ENV : process.env;

export function getWebConfig() {
  return {
    POSTHOG_API_HOST: getNodeOrWebEnv().POSTHOG_API_HOST?.trim() ?? "",
    POSTHOG_API_KEY: getNodeOrWebEnv().POSTHOG_API_KEY?.trim() ?? "",
    SENTRY_DSN: getNodeOrWebEnv().SENTRY_DSN?.trim() ?? "",
    ENVIRONMENT: getNodeOrWebEnv().ENVIRONMENT ?? "local",
  };
}

export default function get(): Config {
  if (instance === undefined) {
    const STRAPI_API = process.env.STRAPI_API?.trim();
    const STRAPI_HOST = process.env.STRAPI_HOST?.trim();

    instance = {
      STRAPI_API: STRAPI_API ?? `${STRAPI_HOST}/api/`,
      STRAPI_HOST: STRAPI_HOST ?? STRAPI_API?.replace("api/", "") ?? "",
      STRAPI_ACCESS_KEY: process.env.STRAPI_ACCESS_KEY?.trim() ?? "",
      CMS: process.env.CMS?.trim() ?? "FILE",
    };
  }

  return instance;
}
