import { z } from "zod";
import { StrapiAccordionSchema } from "~/services/cms/models/StrapiAccordion";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiHeadingOptionalSchema } from "./StrapiHeading";
import { StrapiImageOptionalSchema } from "./StrapiImage";

export const StrapiListItemSchema = z
  .object({
    headline: StrapiHeadingOptionalSchema,
    content: StrapiRichTextOptionalSchema(),
    buttons: z.array(StrapiButtonSchema).nullable().transform(omitNull),
    accordion: StrapiAccordionSchema.nullable().transform(omitNull),
    image: StrapiImageOptionalSchema,
  })
  .merge(HasStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);
