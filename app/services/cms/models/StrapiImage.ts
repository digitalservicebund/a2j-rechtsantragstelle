import { z } from "zod";
import { StrapiStringOptionalSchema } from "~/services/cms/models/StrapiStringOptional";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

function appendStrapiUrlOnDev(imageUrl: string) {
  // Without S3 bucket, Strapi returns relative URLs
  // For development with local strapi instances, we need to prepend the correct hostname
  if (!imageUrl.startsWith("/")) return imageUrl;
  const { ENVIRONMENT, STRAPI_API } = process.env;
  const strapiUrl =
    (ENVIRONMENT?.trim() === "development"
      ? STRAPI_API?.replace("/api/", "")
      : "") ?? "";

  return strapiUrl + imageUrl;
}

export const StrapiImageSchema = z
  .object({
    url: z.string().transform(appendStrapiUrlOnDev),
    width: z.number(),
    height: z.number(),
    alternativeText: StrapiStringOptionalSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiImageOptionalSchema =
  StrapiImageSchema.nullable().transform(omitNull);
