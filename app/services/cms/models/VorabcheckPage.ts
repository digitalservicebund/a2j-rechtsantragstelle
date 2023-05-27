import { z } from "zod";
import { FormComponentCmsSchema } from "./FormComponentCms";
import { FormContentCmsSchema } from "./FormContentCms";
import { HasIdSchema } from "./HasId";
import { HasLocaleSchema } from "./HasLocale";
import { HasMetaSchema } from "./HasMeta";
import { HasSlugSchema } from "./HasSlug";
import { HasTimestampsSchema } from "./HasTimestamps";

export const VorabcheckPageSchema = z
  .object({
    pre_form: z.array(FormContentCmsSchema),
    form: z.array(FormComponentCmsSchema),
  })
  .merge(HasIdSchema)
  .merge(HasLocaleSchema)
  .merge(HasMetaSchema)
  .merge(HasSlugSchema)
  .merge(HasTimestampsSchema)
  .strict();

export type VorabcheckPage = z.infer<typeof VorabcheckPageSchema>;
