import { z } from "zod";
import { RichTextPropsSchema } from "~/components/RichText";
import { HasOptionalStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { HasStrapiLocaleSchema } from "~/services/cms/models/HasStrapiLocale";
import { HasStrapiMetaSchema } from "~/services/cms/models/HasStrapiMeta";
import { HasStrapiTimestampsSchema } from "~/services/cms/models/HasStrapiTimestamps";

const StrapiVideoSchema = z
  .object({
    title: z.string(),
    url: z.string(),
    datenschutz: RichTextPropsSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiMetaSchema)
  .merge(HasStrapiTimestampsSchema);

type StrapiVideo = z.infer<typeof StrapiVideoSchema>;

export const StrapiVideoComponentSchema = StrapiVideoSchema.extend({
  __component: z.literal("page.video"),
});

export const getVideoProps = (cmsData: StrapiVideo) => {
  return {
    title: cmsData.title,
    url: cmsData.url,
    datenschutz: cmsData.datenschutz,
  };
};
