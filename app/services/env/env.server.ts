import fs from "node:fs";
import path from "path";
import { configDotenv } from "dotenv";

configDotenv({ override: true, quiet: true }); // override is needed to enable live reloading on change

type Config = {
  STRAPI_API: string;
  STRAPI_HOST: string;
  STRAPI_ACCESS_KEY: string;
  CMS: string;
  GERICHTSFINDER_ENCRYPTION_KEY: string;
  REDIS_ENDPOINT: string;
  REDIS_PASSWORD: string;
  COOKIE_SESSION_SECRET: string;
  CONTENT_FILE_PATH: string;
  CSP_REPORT_URI?: string;
  BUNDID_AUTH_BMI_ID?: string;
  SAML_ASSERTION_CONSUMER_SERVICE_URL?: string;
  SAML_SP_LOGIN_REQUEST_TEMPLATE_PATH: string;
  SAML_SP_METADATA_PATH: string;
  SAML_SP_SECRET_KEY_PATH: string;
  SAML_IDP_CERT?: string;
  S3_REGION: string;
  S3_ENDPOINT: string;
  S3_DATA_STORAGE_ACCESS_KEY: string;
  S3_DATA_STORAGE_SECRET_KEY: string;
  S3_DATA_STORAGE_BUCKET_NAME: string;
};

export function config(): Config {
  const STRAPI_API =
    readSecretVolume("/etc/strapi-api-secret/password") ??
    process.env.STRAPI_API ??
    "";

  return {
    STRAPI_API: STRAPI_API ?? "",
    STRAPI_HOST: STRAPI_API?.replace("/api/", "") ?? "",
    STRAPI_ACCESS_KEY:
      readSecretVolume("/etc/strapi-access-key-secret/password") ??
      process.env.STRAPI_ACCESS_KEY ??
      "",
    CMS: process.env.CMS ?? "FILE",
    GERICHTSFINDER_ENCRYPTION_KEY:
      readSecretVolume("/etc/courtdata-secrets/password") ??
      process.env.GERICHTSFINDER_ENCRYPTION_KEY ??
      "",
    REDIS_ENDPOINT: process.env.REDIS_ENDPOINT ?? "localhost:6380",
    REDIS_PASSWORD:
      readSecretVolume("/etc/redis-password-secret/password") ??
      process.env.REDIS_PASSWORD ??
      "",
    COOKIE_SESSION_SECRET:
      readSecretVolume("/etc/cookie-session-secret/password") ??
      process.env.COOKIE_SESSION_SECRET ??
      "s3cr3t",
    CONTENT_FILE_PATH: process.env.CONTENT_FILE_PATH ?? "./content.json",
    CSP_REPORT_URI: process.env.CSP_REPORT_URI,
    BUNDID_AUTH_BMI_ID: process.env.BUNDID_AUTH_BMI_ID?.trim(),
    SAML_ASSERTION_CONSUMER_SERVICE_URL:
      process.env.SAML_ASSERTION_CONSUMER_SERVICE_URL?.trim(),
    SAML_SP_LOGIN_REQUEST_TEMPLATE_PATH: path.join(
      process.cwd(),
      "data/saml/sp_login_request_template.xml",
    ),
    SAML_SP_METADATA_PATH:
      process.env.SAML_SP_METADATA_PATH?.trim() ??
      path.join(process.cwd(), "data/saml/sp_metadata.xml"),
    SAML_SP_SECRET_KEY_PATH:
      process.env.SAML_SP_SECRET_KEY_PATH?.trim() ??
      path.join(process.cwd(), "data/saml/sp_privateKey.pem"),
    SAML_IDP_CERT:
      readSecretVolume("/etc/saml/idp_cert") ??
      process.env.SAML_IDP_CERT?.trim(),
    S3_REGION: process.env.AWS_S3_REGION ?? "eu-central-1",
    S3_ENDPOINT:
      process.env.S3_ENDPOINT ?? "https://s3.localhost.localstack.cloud:4566",
    S3_DATA_STORAGE_ACCESS_KEY:
      readSecretVolume(
        "/etc/s3-storage-credentials-secret-access-key/password",
      ) ??
      process.env.S3_DATA_STORAGE_ACCESS_KEY ??
      "test",
    S3_DATA_STORAGE_SECRET_KEY:
      readSecretVolume("/etc/s3-storage-credentials-secret-key/password") ??
      process.env.S3_DATA_STORAGE_SECRET_KEY ??
      "test",
    S3_DATA_STORAGE_BUCKET_NAME:
      process.env.S3_DATA_STORAGE_BUCKET_NAME ?? "a2j-data-storage",
  };
}

function readSecretVolume(path: string): string | null {
  try {
    return fs.readFileSync(path, "utf8");
  } catch {
    return null;
  }
}
