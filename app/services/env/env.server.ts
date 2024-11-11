interface Config {
  STRAPI_API: string;
  STRAPI_HOST: string;
  STRAPI_ACCESS_KEY: string;
  CMS: string;
  REDIS_ENDPOINT: string;
  REDIS_PASSWORD: string;
  FIT_CONNECT_ADAPTER_ENDPOINT: string;
  COOKIE_SESSION_SECRET: string;
  CONTENT_FILE_PATH: string;
  ENVIRONMENT: string;
  CSP_REPORT_URI?: string;
}

let instance: Config | undefined = undefined;

export function config(): Config {
  if (instance === undefined) {
    const STRAPI_API = process.env.STRAPI_API?.trim();
    const ENVIRONMENT = process.env.ENVIRONMENT?.trim() ?? "development";

    instance = {
      STRAPI_API: STRAPI_API ?? "",
      STRAPI_HOST: STRAPI_API?.replace("/api/", "") ?? "",
      STRAPI_ACCESS_KEY: process.env.STRAPI_ACCESS_KEY?.trim() ?? "",
      CMS: process.env.CMS?.trim() ?? "FILE",
      REDIS_ENDPOINT: process.env.REDIS_ENDPOINT?.trim() ?? "localhost:6380",
      REDIS_PASSWORD: process.env.REDIS_PASSWORD?.trim() ?? "",
      FIT_CONNECT_ADAPTER_ENDPOINT:
        process.env.FIT_CONNECT_ADAPTER_ENDPOINT?.trim() ??
        "http://localhost:8080",
      COOKIE_SESSION_SECRET:
        process.env.COOKIE_SESSION_SECRET?.trim() ?? "s3cr3t",
      CONTENT_FILE_PATH:
        process.env.CONTENT_FILE_PATH?.trim() ?? "./content.json",
      ENVIRONMENT,
      CSP_REPORT_URI: process.env.CSP_REPORT_URI?.trim(),
    };
  }

  return instance;
}
