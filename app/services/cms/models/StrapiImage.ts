import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { config } from "../../env/env.server";

export const StrapiImageSchema = z.object({
  data: z
    .object({
      attributes: z.object({
        name: z.string(),
        url: z
          .string()
          .transform((url) =>
            url.startsWith("/") ? config().STRAPI_HOST + url : url,
          ),
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
        // eslint-disable-next-line camelcase
        provider_metadata: z.string().nullable(),
        createdAt: z.string().datetime({ precision: 3 }),
        updatedAt: z.string().datetime({ precision: 3 }),
      }),
    })
    .merge(HasOptionalStrapiIdSchema)

    .nullable(),
});

export type StrapiImage = z.infer<typeof StrapiImageSchema>;
