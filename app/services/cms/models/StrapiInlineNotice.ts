import { z } from "zod";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundOptionalSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";

export const StrapiInlineNoticeSchema = z
  .object({
    title: z.string(),
    tagName: z.enum(["h1", "h2", "h3", "h4", "h5", "h6", "p", "div"]),
    look: z.enum(["warning", "tips", "success", "error"]),
    content: StrapiRichTextOptionalSchema(),
    container: StrapiContainerSchema,
    outerBackground: StrapiBackgroundOptionalSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema)
  .transform((cmsData) => ({
    __component: "page.inline-notice" as const,
    ...cmsData,
  }));
