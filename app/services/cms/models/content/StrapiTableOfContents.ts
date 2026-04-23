import { z } from "zod";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "../HasStrapiLinkIdentifier";
import { StrapiButtonSchema } from "../StrapiButton";
import { StrapiHeadingOptionalSchema } from "./StrapiHeading";
import { StrapiLinkSchema } from "../StrapiLink";
import { StrapiPaddingOptionalSchema } from "../StrapiPadding";
import { StrapiBackgroundColorOptionalSchema } from "../StrapiBackgroundColor";

export const StrapiTableOfContentsSchema = z.object({
  label: StrapiHeadingOptionalSchema,
  heading: StrapiHeadingOptionalSchema,
  buttons: z.array(StrapiButtonSchema),
  links: z.array(StrapiLinkSchema),
  contentBackgroundColor: StrapiBackgroundColorOptionalSchema,
  paddingTop: StrapiPaddingOptionalSchema,
  paddingBottom: StrapiPaddingOptionalSchema,
  sectionBackgroundColor: StrapiBackgroundColorOptionalSchema,
  __component: z.literal("page.table-of-contents"),
  ...HasStrapiIdSchema.shape,
  ...OptionalStrapiLinkIdentifierSchema.shape,
});
