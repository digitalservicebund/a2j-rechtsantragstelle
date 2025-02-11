import { z } from "zod";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiHeadingSchema } from "./StrapiHeading";

export const StrapiListItemSchema = z
  .object({
    headline: StrapiHeadingSchema.nullable(),
    content: StrapiRichTextOptionalSchema(),
    buttons: z.array(StrapiButtonSchema).nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema)
  .transform((cmsData) => cmsData);
