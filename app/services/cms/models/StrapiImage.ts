import { z } from "zod";
import { StrapiStringOptionalSchema } from "~/services/cms/models/StrapiStringOptional";
import { config } from "~/services/env/env.server";
import { config as publicConfig } from "~/services/env/public";
import { omitNull } from "~/util/omitNull";
import { decodeBase64 } from "~/util/strings";

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

export const StrapiImageSchema = z
  .object({
    url: z.string().transform(appendStrapiUrlOnDev),
    width: z.number(),
    height: z.number(),
    mime: z.string().optional(),
    alternativeText: StrapiStringOptionalSchema,
  })
  .transform(async (cmsImage) => {
    // Non-svg image: return
    if (cmsImage.mime !== "image/svg+xml") return cmsImage;

    // SVG Image: Either decode from base64 or fetch from URL
    // Note: this is mixing data validation / transformation with enriching
    // We should find a more idiomatic way for this in the future
    const svgString = cmsImage.url.startsWith("data:image/svg+xml;base64")
      ? decodeBase64(cmsImage.url.split(",")[1])
      : await (await fetch(cmsImage.url)).text();
    return { ...cmsImage, svgString, url: "" };
  });

export const StrapiImageOptionalSchema = StrapiImageSchema.nullable()
  .transform(omitNull)
  .optional();
