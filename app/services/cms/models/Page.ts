import { z } from "zod";
import { FormContentCmsSchema } from "./FormContentCms";
import { TimestampableSchema } from "./Timestampable";

export const PageSchema = TimestampableSchema.merge(
  z.object({
    slug: z.string(),
    meta: z.object({
      title: z.string(),
    }),
    content: z.array(FormContentCmsSchema),
  })
);

export type Page = z.infer<typeof PageSchema>;
