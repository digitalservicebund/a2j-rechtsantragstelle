import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "../HasStrapiLinkIdentifier";
import { StrapiHeadingOptionalSchema } from "./StrapiHeading";
import { StrapiPaddingOptionalSchema } from "../StrapiPadding";


export const StrapiPageHeadingSchema = z.object({
  heading: StrapiHeadingOptionalSchema,
  paddingTop: StrapiPaddingOptionalSchema,
  paddingBottom: StrapiPaddingOptionalSchema,
  __component: z.literal("page.heading"),
  ...HasStrapiIdSchema.shape,
  ...OptionalStrapiLinkIdentifierSchema.shape,
});
