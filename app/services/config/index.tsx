export interface config {
  STRAPI_API: string;
  STRAPI_ACCESS_KEY: string;
  CMS: string;
  ENV: string;
}

let instance: config | undefined = undefined;

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
