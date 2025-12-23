import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiBackgroundOptionalSchema } from "../StrapiBackground";

export const StrapiDetailsSchema = z
  .object({
    title: z.string(),
    content: buildRichTextValidation(),
    outerBackground: StrapiBackgroundOptionalSchema,
    container: StrapiBackgroundOptionalSchema,
    ...HasStrapiIdSchema.shape,
  })
  .transform((cmsData) => ({
    __component: "page.details-summary" as const,
    ...cmsData,
  }));
