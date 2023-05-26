import { z } from "zod";
import { FormContentCmsSchema } from "./FormContentCms";
import { HasTimestampsSchema } from "./HasTimestamps";

export const PageSchema = HasTimestampsSchema.merge(
  z.object({
    slug: z.string(),
    meta: z.object({
      title: z.string(),
    }),
    content: z.array(FormContentCmsSchema),
  })
);

export type Page = z.infer<typeof PageSchema>;
