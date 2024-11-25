import pick from "lodash/pick";
import { z } from "zod";
import { type LinkListBoxProps } from "~/components/LinkListBox";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiContainerSchema } from "./StrapiContainer";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiLinkSchema } from "./StrapiLink";

const StrapiLinkListBoxSchema = z
  .object({
    label: StrapiHeadingSchema.nullable(),
    heading: StrapiHeadingSchema.nullable(),
    buttons: z.array(StrapiButtonSchema),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
    links: z.array(StrapiLinkSchema),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiLinkListBox = z.infer<typeof StrapiLinkListBoxSchema>;

export const StrapiLinkListBoxComponentSchema = StrapiLinkListBoxSchema.extend({
  __component: z.literal("page.link-list-box"),
});

export const getLinkListBoxProps = (
  cmsData: StrapiLinkListBox,
): LinkListBoxProps =>
  pick(omitNull(cmsData), "label", "heading", "buttons", "links");
