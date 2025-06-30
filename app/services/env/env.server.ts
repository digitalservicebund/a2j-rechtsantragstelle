import { configDotenv } from "dotenv";

configDotenv({ override: true, quiet: true }); // override is needed to enable live reloading on change

type Config = {
  STRAPI_API: string;
  STRAPI_HOST: string;
  STRAPI_ACCESS_KEY: string;
  CMS: string;
  REDIS_ENDPOINT: string;
  REDIS_PASSWORD: string;
  COOKIE_SESSION_SECRET: string;
  CONTENT_FILE_PATH: string;
  CSP_REPORT_URI?: string;
  S3_REGION: string;
  S3_ENDPOINT: string;
  S3_DATA_STORAGE_ACCESS_KEY: string;
  S3_DATA_STORAGE_SECRET_KEY: string;
  S3_DATA_STORAGE_BUCKET_NAME: string;
};

export function config(): Config {
  const STRAPI_API = process.env.STRAPI_API;

  return {
    STRAPI_API: STRAPI_API ?? "",
    STRAPI_HOST: STRAPI_API?.replace("/api/", "") ?? "",
    STRAPI_ACCESS_KEY: process.env.STRAPI_ACCESS_KEY ?? "",
    CMS: process.env.CMS ?? "FILE",
    REDIS_ENDPOINT: process.env.REDIS_ENDPOINT ?? "localhost:6380",
    REDIS_PASSWORD: process.env.REDIS_PASSWORD ?? "",
    COOKIE_SESSION_SECRET: process.env.COOKIE_SESSION_SECRET ?? "s3cr3t",
    CONTENT_FILE_PATH: process.env.CONTENT_FILE_PATH ?? "./content.json",
    CSP_REPORT_URI: process.env.CSP_REPORT_URI,
    S3_REGION: process.env.AWS_S3_REGION ?? "eu-central-1",
    S3_ENDPOINT:
      process.env.S3_ENDPOINT ?? "https://s3.localhost.localstack.cloud:4566",
    S3_DATA_STORAGE_ACCESS_KEY:
      process.env.S3_DATA_STORAGE_ACCESS_KEY ?? "test",
    S3_DATA_STORAGE_SECRET_KEY:
      process.env.S3_DATA_STORAGE_SECRET_KEY ?? "test",
    S3_DATA_STORAGE_BUCKET_NAME:
      process.env.S3_DATA_STORAGE_BUCKET_NAME ?? "a2j-data-storage",
  };
}
