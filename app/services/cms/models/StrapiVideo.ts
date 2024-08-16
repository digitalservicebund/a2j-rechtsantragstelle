import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "~/services/cms/models/HasStrapiId";

const StrapiVideoSchema = z
  .object({
    title: z.string(),
    url: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiVideo = z.infer<typeof StrapiVideoSchema>;

export const StrapiVideoComponentSchema = StrapiVideoSchema.extend({
  __component: z.literal("page.video"),
});

export const getVideoProps = (cmsData: StrapiVideo) => {
  return {
    title: cmsData.title,
    url: cmsData.url,
  };
};
