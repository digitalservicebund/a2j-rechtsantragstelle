import { z } from "zod";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiHeadingSchema } from "./StrapiHeading";

export const StrapiListItemSchema = z
  .object({
    headline: StrapiHeadingSchema.nullable().transform(omitNull).optional(),
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
