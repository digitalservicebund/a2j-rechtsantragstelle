import { z } from "zod";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { HasStrapiSlugSchema } from "./HasStrapiSlug";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { StrapiContentComponentSchema } from "./StrapiContentComponent";
import { StrapiElementWithIdSchema } from "./StrapiElementWithId";
import { StrapiFlowIdSchema } from "./StrapiFlowId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiLinkSchema } from "./StrapiLink";
import { StrapiParagraphSchema } from "./StrapiParagraph";
import { StrapiResultPageTypeSchema } from "./StrapiResultPageType";

export const StrapiResultPageSchema = z
  .object({
    stepId: z.string().nullable(),
    flow_ids: z.object({
      data: z.array(z.object({ attributes: StrapiFlowIdSchema })),
    }),
    pageType: StrapiResultPageTypeSchema,
    heading: StrapiHeadingSchema,
    hintText: StrapiParagraphSchema.nullable(),
    reasonings: z.object({
      data: z
        .array(
          HasStrapiIdSchema.extend({
            attributes: StrapiElementWithIdSchema,
          }),
        )
        .nullable(),
    }),
    documents: z.object({
      data: HasStrapiIdSchema.extend({
        attributes: StrapiElementWithIdSchema,
      }).nullable(),
    }),
    nextSteps: z.object({
      data: HasStrapiIdSchema.extend({
        attributes: StrapiElementWithIdSchema,
      }).nullable(),
    }),
    freeZone: z.array(StrapiContentComponentSchema),
    nextLink: StrapiLinkSchema.nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiMetaSchema)
  .merge(HasStrapiSlugSchema)
  .merge(HasStrapiTimestampsSchema);
