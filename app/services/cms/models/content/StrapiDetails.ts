import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiBackgroundOptionalSchema } from "../StrapiBackground";
import { StrapiKernBackgroundColorOptionalSchema } from "~/services/cms/models/StrapiBackgroundColor";

export const StrapiDetailsSchema = z
  .object({
    title: z.string(),
    content: buildRichTextValidation(),
    outerBackground: StrapiBackgroundOptionalSchema,
    container: StrapiBackgroundOptionalSchema,
    sectionBackgroundColor: StrapiKernBackgroundColorOptionalSchema,
    ...HasStrapiIdSchema.shape,
  })
  .transform((cmsData) => ({
    __component: "page.details-summary" as const,
    ...cmsData,
  }));
