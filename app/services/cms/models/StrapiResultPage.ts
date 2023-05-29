import { z } from "zod";
import { StrapiElementWithIdSchema } from "./StrapiElementWithId";
import { StrapiContentSchema } from "./StrapiContent";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { HasStrapiSlugSchema } from "./HasStrapiSlug";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiLinkSchema } from "./StrapiLink";
import { StrapiParagraphSchema } from "./StrapiParagraph";
import { StrapiResultPageTypeSchema } from "./StrapiResultPageType";

export const StrapiResultPageSchema = z
  .object({
    pageType: StrapiResultPageTypeSchema,
    heading: StrapiHeadingSchema,
    hintText: StrapiParagraphSchema.nullable(),
    linkText: z.string().nullable(),
    reasonings: z.object({
      data: z
        .array(
          z.object({
            id: z.number(),
            attributes: StrapiElementWithIdSchema,
          })
        )
        .nullable(),
    }),
    documents: z.object({
      data: z
        .object({
          id: z.number(),
          attributes: StrapiElementWithIdSchema,
        })
        .nullable(),
    }),
    nextSteps: z.object({
      data: z
        .object({
          id: z.number(),
          attributes: StrapiElementWithIdSchema,
        })
        .nullable(),
    }),
    freeZone: z.array(StrapiContentSchema),
    nextLink: StrapiLinkSchema.nullable(),
  })
  .merge(HasStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiMetaSchema)
  .merge(HasStrapiSlugSchema)
  .merge(HasStrapiTimestampsSchema)
  .strict();

export type StrapiResultPage = z.infer<typeof StrapiResultPageSchema>;
