import { z } from "zod";
import { StrapiElementWithIdSchema } from "./StrapiElementWithId";
import { FormContentCmsSchema } from "./FormContentCms";
import { HasIdSchema } from "./HasId";
import { HasLocaleSchema } from "./HasLocale";
import { HasMetaSchema } from "./HasMeta";
import { HasSlugSchema } from "./HasSlug";
import { HasTimestampsSchema } from "./HasTimestamps";
import { HeadingSchema } from "./Heading";
import { LinkSchema } from "./Link";
import { ParagraphSchema } from "./Paragraph";
import { ResultPageTypeSchema } from "./ResultPageType";

export const ResultPageSchema = z
  .object({
    pageType: ResultPageTypeSchema,
    heading: HeadingSchema,
    hintText: ParagraphSchema.nullable(),
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
    freeZone: z.array(FormContentCmsSchema),
    nextLink: LinkSchema.nullable(),
  })
  .merge(HasIdSchema)
  .merge(HasLocaleSchema)
  .merge(HasMetaSchema)
  .merge(HasSlugSchema)
  .merge(HasTimestampsSchema)
  .strict();

export type ResultPage = z.infer<typeof ResultPageSchema>;
