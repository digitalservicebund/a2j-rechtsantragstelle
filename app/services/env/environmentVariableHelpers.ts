import fs from "node:fs";

export function getStrapiApi() {
  return (
    readSecretVolume("/etc/strapi-api-secret/password") ??
    process.env.STRAPI_API ??
    ""
  );
}

export function getStrapiAccessKey() {
  return (
    readSecretVolume("/etc/strapi-access-key-secret/password") ??
    process.env.STRAPI_ACCESS_KEY ??
    ""
  );
}

export function getGerichtsfinderEncryptionKey() {
  return (
    readSecretVolume("/etc/courtdata-secrets/password") ??
    process.env.GERICHTSFINDER_ENCRYPTION_KEY ??
    ""
  );
}

export function getRedisPassword() {
  return (
    readSecretVolume("/etc/redis-password-secret/password") ??
    process.env.REDIS_PASSWORD ??
    ""
  );
}

export function getCookieSessionSecret() {
  return (
    readSecretVolume("/etc/cookie-session-secret/password") ??
    process.env.COOKIE_SESSION_SECRET ??
    ""
  );
}

export function getSamlIDPCert() {
  return (
    readSecretVolume("/etc/saml/idp_cert") ??
    process.env.SAML_IDP_CERT?.trim() ??
    ""
  );
}

export function getS3DataStorageAccessKey() {
  return (
    readSecretVolume(
      "/etc/s3-storage-credentials-secret-access-key/password",
    ) ??
    process.env.S3_DATA_STORAGE_ACCESS_KEY ??
    ""
  );
}

export function getS3DataStorageSecretKey() {
  return (
    readSecretVolume("/etc/s3-storage-credentials-secret-key/password") ??
    process.env.S3_DATA_STORAGE_SECRET_KEY ??
    ""
  );
}

function readSecretVolume(path: string): string | null {
  try {
    return fs.readFileSync(path, "utf8");
  } catch {
    return null;
  }
}
