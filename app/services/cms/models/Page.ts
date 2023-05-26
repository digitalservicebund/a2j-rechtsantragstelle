import { z } from "zod";
import { FormContentCmsSchema } from "./FormContentCms";
import { HasTimestampsSchema } from "./HasTimestamps";

export const PageSchema = z
  .object({
    slug: z.string(),
    meta: z.object({
      title: z.string(),
    }),
    content: z.array(FormContentCmsSchema),
  })
  .merge(HasTimestampsSchema);

export type Page = z.infer<typeof PageSchema>;
