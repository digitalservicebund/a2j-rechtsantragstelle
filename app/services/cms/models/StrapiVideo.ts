import { z } from "zod";
import { RichTextPropsSchema } from "~/components/RichText";
import { HasOptionalStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { StrapiContainerSchema } from "~/services/cms/models/StrapiContainer";
import { omitNull } from "~/util/omitNull";

const StrapiVideoSchema = z
  .object({
    title: z.string(),
    url: z.string(),
    dataProtection: z.string(),
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiVideo = z.infer<typeof StrapiVideoSchema>;

export const StrapiVideoComponentSchema = StrapiVideoSchema.extend({
  __component: z.literal("page.video"),
});

export const getVideoProps = (cmsData: StrapiVideo) => {
  const markdown = cmsData.dataProtection;
  return {
    title: cmsData.title,
    url: cmsData.url,
    dataProtection: RichTextPropsSchema.parse(
      omitNull({ ...cmsData, markdown }),
    ),
    container: StrapiContainerSchema.parse(cmsData.container),
  };
};
