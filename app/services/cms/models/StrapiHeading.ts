import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { stringWithHtmlEntities } from "./stringWithHtmlEntities";

export const StrapiHeadingSchema = z
  .object({
    text: stringWithHtmlEntities,
    tagName: z.enum(["h1", "h2", "h3", "h4", "h5", "h6", "p", "div"]),
    look: z.enum([
      "default",
      "ds-heading-01-reg",
      "ds-heading-02-reg",
      "ds-heading-03-reg",
      "ds-heading-03-bold",
      "ds-subhead",
      "ds-label-01-reg",
      "ds-label-01-bold",
      "ds-label-02-reg",
      "ds-label-02-bold",
      "ds-label-03-reg",
      "ds-label-03-bold",
      "ds-label-section",
      "ds-body-01-reg",
      "ds-body-02-reg",
    ]),
  })
  .merge(HasOptionalStrapiIdSchema)
  .nullable()
  .transform((cmsData) => {
    return omitNull({
      __component: "basic.heading" as const,
      ...cmsData,
    });
  });

export const StrapiHeadingOptionalSchema = StrapiHeadingSchema.nullable()
  .transform(omitNull)
  .optional();
