import path from "node:path";
import { configDotenv } from "dotenv";
import { readSecretOrEnvVar } from "~/services/env/readSecretOrEnvVar.server";

configDotenv({ override: true, quiet: true }); // override is needed to enable live reloading on change

type Config = {
  STRAPI_API: string;
  STRAPI_HOST: string;
  STRAPI_ACCESS_KEY: string;
  CMS: string;
  CMS_MEDIA_STORAGE_URL?: string;
  GERICHTSFINDER_ENCRYPTION_KEY: string;
  GERICHTSFINDER_ENCRYPTION_KEY_OLD: string;
  REDIS_URI: string;
  COOKIE_SESSION_SECRET: string;
  CONTENT_FILE_PATH: string;
  CSP_REPORT_URI?: string;
  BUNDID_AUTH_BMI_ID?: string;
  BUNDID_ENTITY_ID: string;
  SAML_ASSERTION_CONSUMER_SERVICE_URL: string;
  SAML_SP_LOGIN_REQUEST_TEMPLATE_PATH: string;
  SAML_SP_METADATA_PATH: string;
  SAML_SP_SECRET_KEY_PATH: string;
  SAML_SP_SECRET_KEY_ENCRYPTION_PATH: string;
  SAML_IDP_CERT: string;
  S3_REGION?: string;
  S3_ENDPOINT?: string;
  S3_DATA_STORAGE_ACCESS_KEY?: string;
  S3_DATA_STORAGE_SECRET_KEY?: string;
  S3_DATA_STORAGE_BUCKET_NAME?: string;
  ENABLE_SESSION_ENCRYPTION: boolean;
};

let cachedConfig: Config | undefined;

export function config(): Config {
  if (cachedConfig) return cachedConfig;

  const STRAPI_API =
    readSecretOrEnvVar("/etc/strapi-api-secret/password", "STRAPI_API") ?? "";

  // Fallback Redis URI for environments that provide credentials individually
  // rather than a full URI. Can be removed once the cloud migration is complete.
  const REDIS_ENDPOINT = process.env.REDIS_ENDPOINT ?? "localhost:6380";
  const REDIS_PASSWORD = readSecretOrEnvVar(
    "/etc/redis-password-secret/password",
    "REDIS_PASSWORD",
  );
  const fallbackRedisURI = `rediss://default:${REDIS_PASSWORD}@${REDIS_ENDPOINT}`;

  const COOKIE_SESSION_SECRET =
    readSecretOrEnvVar(
      "/etc/cookie-session-secret/password",
      "COOKIE_SESSION_SECRET",
    ) ?? "";

  const GERICHTSFINDER_ENCRYPTION_KEY =
    readSecretOrEnvVar(
      "/etc/courtdata-secrets/password",
      "GERICHTSFINDER_ENCRYPTION_KEY",
    ) ?? "";

  if (!COOKIE_SESSION_SECRET) {
    throw new Error("Missing required config: COOKIE_SESSION_SECRET");
  }
  if (!GERICHTSFINDER_ENCRYPTION_KEY) {
    throw new Error("Missing required config: GERICHTSFINDER_ENCRYPTION_KEY");
  }

  cachedConfig = {
    STRAPI_API,
    STRAPI_HOST: STRAPI_API.replace("/api/", ""),
    ENABLE_SESSION_ENCRYPTION:
      process.env.ENABLE_SESSION_ENCRYPTION !== "false",
    STRAPI_ACCESS_KEY:
      readSecretOrEnvVar(
        "/etc/strapi-access-key-secret/password",
        "STRAPI_ACCESS_KEY",
      ) ?? "",
    CMS: process.env.CMS ?? "FILE",
    CMS_MEDIA_STORAGE_URL: process.env.CMS_MEDIA_STORAGE_URL,
    GERICHTSFINDER_ENCRYPTION_KEY,
    GERICHTSFINDER_ENCRYPTION_KEY_OLD:
      readSecretOrEnvVar(
        "/etc/courtdata-secrets/password-old",
        "GERICHTSFINDER_ENCRYPTION_KEY_OLD",
      ) ?? "",
    REDIS_URI:
      readSecretOrEnvVar("/etc/redis-credentials/uri", "REDIS_URI") ??
      fallbackRedisURI,
    COOKIE_SESSION_SECRET,
    CONTENT_FILE_PATH: process.env.CONTENT_FILE_PATH ?? "./content.json",
    CSP_REPORT_URI: process.env.CSP_REPORT_URI,
    BUNDID_AUTH_BMI_ID: process.env.BUNDID_AUTH_BMI_ID?.trim(),
    BUNDID_ENTITY_ID: process.env.BUNDID_ENTITY_ID?.trim() ?? "",
    SAML_ASSERTION_CONSUMER_SERVICE_URL:
      process.env.SAML_ASSERTION_CONSUMER_SERVICE_URL?.trim() ?? "",
    SAML_SP_LOGIN_REQUEST_TEMPLATE_PATH: path.join(
      process.cwd(),
      "data/saml/sp_login_request_template.xml",
    ),
    SAML_SP_METADATA_PATH:
      process.env.SAML_SP_METADATA_PATH ??
      "/etc/saml/sp_metadata/sp_metadata.xml",
    SAML_SP_SECRET_KEY_PATH:
      process.env.SAML_SP_SECRET_KEY_PATH ??
      "/etc/saml/sp_private_key/sp_private_key.pem",
    SAML_SP_SECRET_KEY_ENCRYPTION_PATH:
      process.env.SAML_SP_SECRET_KEY_ENCRYPTION_PATH ??
      "/etc/saml/sp_private_key_encryption/sp_private_key_encryption.pem",
    SAML_IDP_CERT: process.env.SAML_IDP_CERT?.replaceAll(" ", "") ?? "",
    S3_REGION: process.env.S3_REGION,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_DATA_STORAGE_ACCESS_KEY: readSecretOrEnvVar(
      "/etc/s3-storage-credentials-secret-access-key/password",
      "S3_DATA_STORAGE_ACCESS_KEY",
    ),
    S3_DATA_STORAGE_SECRET_KEY: readSecretOrEnvVar(
      "/etc/s3-storage-credentials-secret-key/password",
      "S3_DATA_STORAGE_SECRET_KEY",
    ),
    S3_DATA_STORAGE_BUCKET_NAME:
      process.env.S3_DATA_STORAGE_BUCKET_NAME ?? "a2j-data-storage",
  };

  return cachedConfig;
}
