import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "~/services/cms/models/HasStrapiId";

export const StrapiVideoSchema = z
  .object({
    title: z.string(),
    url: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform((cmsData) => ({
    __component: "page.video" as const,
    ...cmsData,
  }));
