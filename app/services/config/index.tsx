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
      STRAPI_API: process.env.STRAPI_API || "",
      STRAPI_ACCESS_KEY: process.env.STRAPI_ACCESS_KEY || "",
      CMS: process.env.CMS || "",
      ENV: process.env.NODE_ENV || "development",
    };
  }
  return instance;
}
