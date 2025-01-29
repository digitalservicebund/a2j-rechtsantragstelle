import path from "path";

type Config = {
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
  SAML_SP_METADATA_PATH: string;
  SAML_SP_SECRET_KEY_PATH: string;
  SAML_IDP_CERT?: string;
  S3_REGION: string;
  S3_ENDPOINT: string;
  S3_DATA_STORAGE_ACCESS_KEY: string;
  S3_DATA_STORAGE_SECRET_KEY: string;
  S3_DATA_STORAGE_BUCKET_NAME: string;
};

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
      SAML_SP_METADATA_PATH:
        process.env.SAML_SP_METADATA_PATH?.trim() ??
        path.join(process.cwd(), "data/saml/sp_metadata.xml"),
      SAML_SP_SECRET_KEY_PATH:
        process.env.SAML_SP_SECRET_KEY_PATH?.trim() ??
        path.join(process.cwd(), "data/saml/sp_privateKey.pem"),
      SAML_IDP_CERT: process.env.SAML_IDP_CERT?.trim(),
      S3_REGION: process.env.AWS_S3_REGION?.trim() ?? "eu-central-1",
      S3_ENDPOINT:
        process.env.S3_ENDPOINT?.trim() ??
        "https://s3.localhost.localstack.cloud:4566",
      S3_DATA_STORAGE_ACCESS_KEY:
        process.env.S3_DATA_STORAGE_ACCESS_KEY?.trim() ?? "test",
      S3_DATA_STORAGE_SECRET_KEY:
        process.env.S3_DATA_STORAGE_SECRET_KEY?.trim() ?? "test",
      S3_DATA_STORAGE_BUCKET_NAME:
        process.env.S3_DATA_STORAGE_BUCKET_NAME?.trim() ??
        "a2j-rechtsantragstelle-data-storage",
    };
  }

  return instance;
}
