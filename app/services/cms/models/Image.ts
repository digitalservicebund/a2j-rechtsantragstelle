import { z } from "zod";

export const ImageSchema = z.object({
  data: z
    .object({
      attributes: z.object({
        url: z.string(),
        width: z.number(),
        height: z.number(),
        alternativeText: z.string().nullable(),
        ext: z.string(),
      }),
    })
    .nullable(),
});

export type Image = z.infer<typeof ImageSchema>;
