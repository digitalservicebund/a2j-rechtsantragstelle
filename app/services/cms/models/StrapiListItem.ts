import { z } from "zod";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiHeadingOptionalSchema } from "./StrapiHeading";

export const StrapiListItemSchema = z
  .object({
    headline: StrapiHeadingOptionalSchema,
    content: StrapiRichTextOptionalSchema(),
    buttons: z
      .array(StrapiButtonSchema)
      .nullable()
      .transform(omitNull)
      .optional(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema)
  .transform((cmsData) => cmsData);
