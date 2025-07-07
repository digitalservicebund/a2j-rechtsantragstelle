import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundOptionalSchema } from "./StrapiBackground";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiContainerSchema } from "./StrapiContainer";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema } from "./StrapiParagraph";

export const StrapiBoxSchema = z
  .object({
    label: StrapiHeadingSchema.nullable().transform(omitNull),
    heading: StrapiHeadingSchema.nullable().transform(omitNull),
    content: StrapiParagraphSchema.nullable().transform(omitNull),
    outerBackground: StrapiBackgroundOptionalSchema,
    container: StrapiContainerSchema,
    buttons: z
      .array(StrapiButtonSchema)
      .nullable()
      .transform(omitNull)
      .optional(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema)
  .transform((cmsData) => ({
    __component: "page.box" as const,
    ...cmsData,
  }));
