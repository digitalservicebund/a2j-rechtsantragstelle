import { z } from "zod";
import { FormComponentCmsSchema } from "./FormComponentCms";
import { FormContentCmsSchema } from "./FormContentCms";
import { HasTimestampsSchema } from "./HasTimestamps";

export const VorabcheckPageSchema = z
  .object({
    slug: z.string(),
    meta: z.object({
      id: z.number(),
      title: z.string(),
    }),
    pre_form: z.array(FormContentCmsSchema),
    form: z.array(FormComponentCmsSchema),
  })
  .merge(HasTimestampsSchema);

export type VorabcheckPage = z.infer<typeof VorabcheckPageSchema>;
