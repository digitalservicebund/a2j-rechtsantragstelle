import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { Alert } from "~/components/Alert";

const StrapiAlertSchema = z
  .object({
    heading: StrapiHeadingSchema.nullable(),
    look: z.enum(["hint"]),
    content: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiAlert = z.infer<typeof StrapiAlertSchema>;

export const StrapiAlertComponentSchema = StrapiAlertSchema.extend({
  __component: z.literal("basic.alert"),
});

export const renderAlertFromStrapi = (strapiAlert: StrapiAlert) => {
  const { heading, look, content } = strapiAlert;
  return <Alert heading={heading} look={look} content={content ?? undefined} />;
};
