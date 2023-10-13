import { z } from "zod";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiContainerSchema } from "./StrapiContainer";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiLinkSchema } from "./StrapiLink";
import { LinkListBoxPropsSchema } from "~/components/LinkListBox";
import { omitNull } from "~/util/omitNull";

export const StrapiLinkListBoxSchema = z
  .object({
    __component: z.literal("page.link-list-box").optional(),
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

export const getLinkListBoxProps = (cmsData: StrapiLinkListBox) => {
  return LinkListBoxPropsSchema.parse(omitNull(cmsData));
};
