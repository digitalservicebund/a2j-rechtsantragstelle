import { z } from "zod";
import { StrapiStringOptionalSchema } from "~/services/cms/models/StrapiStringOptional";
import { config } from "~/services/env/env.server";
import { config as publicConfig } from "~/services/env/public";
import { omitNull } from "~/util/omitNull";

function appendStrapiUrlOnDev(imageUrl: string) {
  // Without S3 bucket, Strapi returns relative URLs
  // For development with local strapi instances, we need to prepend the correct hostname
  if (!imageUrl.startsWith("/")) return imageUrl;
  const { STRAPI_HOST } = config();
  const { ENVIRONMENT } = publicConfig();
  const strapiUrl =
    (ENVIRONMENT?.trim() === "development" ? STRAPI_HOST : "") ?? "";

  return strapiUrl + imageUrl;
}

export const StrapiImageSchema = z.object({
  url: z.string().transform(appendStrapiUrlOnDev),
  width: z.number(),
  height: z.number(),
  alternativeText: StrapiStringOptionalSchema,
});

export const StrapiImageOptionalSchema = StrapiImageSchema.nullable()
  .transform(omitNull)
  .optional();
