import { z } from "zod";
import { FormContentCmsSchema } from "./FormContentCms";
import { HasLocaleSchema } from "./HasLocale";
import { HasMetaSchema } from "./HasMeta";
import { HasSlugSchema } from "./HasSlug";
import { HasTimestampsSchema } from "./HasTimestamps";

export const PageSchema = z
  .object({
    content: z.array(FormContentCmsSchema),
  })
  .merge(HasLocaleSchema)
  .merge(HasMetaSchema)
  .merge(HasSlugSchema)
  .merge(HasTimestampsSchema)
  .strict();

export type Page = z.infer<typeof PageSchema>;
