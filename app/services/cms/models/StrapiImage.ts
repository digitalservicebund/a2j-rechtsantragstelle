import pick from "lodash/pick";
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
    name: z.string(),
    url: z.string().transform(appendStrapiUrlOnDev),
    previewUrl: z.string().url().nullable(),
    width: z.number(),
    height: z.number(),
    size: z.number(),
    alternativeText: StrapiStringOptionalSchema,
    ext: z.string().startsWith("."),
    mime: z.string().startsWith("image/"),
    caption: z.string().nullable(),
    formats: z.record(z.string(), z.unknown()).nullable(),
    hash: z.string(),
    provider: z.string(),
    provider_metadata: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .nullish()
  .transform((cmsData) => {
    if (!cmsData) return undefined;
    return pick(cmsData, "url", "width", "height", "alternativeText");
  });

export const StrapiImageOptionalSchema = StrapiImageSchema.nullable()
  .transform(omitNull)
  .optional();

export type StrapiImage = z.infer<typeof StrapiImageSchema>;
export type StrapiImageInput = z.input<typeof StrapiImageSchema>;
