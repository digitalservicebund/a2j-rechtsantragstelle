import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { StrapiHeadingOptionalSchema } from "../content/StrapiHeading";
import { StrapiParagraphSchema } from "../content/StrapiParagraph";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "../HasStrapiLinkIdentifier";
import { StrapiBackgroundOptionalSchema } from "../StrapiBackground";
import { StrapiButtonSchema } from "../StrapiButton";
import { StrapiContainerSchema } from "../StrapiContainer";

export const StrapiBoxSchema = z.object({
  label: StrapiHeadingOptionalSchema,
  heading: StrapiHeadingOptionalSchema,
  content: StrapiParagraphSchema.nullable().transform(omitNull),
  outerBackground: StrapiBackgroundOptionalSchema,
  container: StrapiContainerSchema,
  buttons: z.array(StrapiButtonSchema).nullable().transform(omitNull),
  __component: z.literal("page.box"),
  ...HasStrapiIdSchema.shape,
  ...OptionalStrapiLinkIdentifierSchema.shape,
});
