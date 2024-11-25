import { z } from "zod";
import { type ImageProps } from "~/components/Image";
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

export const StrapiImageSchema = z.object({
  data: z
    .object({
      attributes: z.object({
        name: z.string(),
        url: z.string().transform(appendStrapiUrlOnDev),
        previewUrl: z.string().url().nullable(),
        width: z.number(),
        height: z.number(),
        size: z.number(),
        alternativeText: z.string().nullable(),
        ext: z.string().startsWith("."),
        mime: z.string().startsWith("image/"),
        caption: z.string().nullable(),
        formats: z.record(z.string(), z.unknown()).nullable(),
        hash: z.string(),
        provider: z.string(),

        provider_metadata: z.string().nullable(),
        createdAt: z.string().datetime({ precision: 3 }),
        updatedAt: z.string().datetime({ precision: 3 }),
      }),
    })
    .merge(HasOptionalStrapiIdSchema)
    .nullish(),
});

export type StrapiImage = z.infer<typeof StrapiImageSchema>;

export const getImageProps = (
  cmsData: StrapiImage | null,
): ImageProps | undefined => {
  if (!cmsData?.data?.attributes) return undefined;
  const { url, width, height, alternativeText } = cmsData.data.attributes;
  return { url, width, height, alternativeText: alternativeText ?? undefined };
};
