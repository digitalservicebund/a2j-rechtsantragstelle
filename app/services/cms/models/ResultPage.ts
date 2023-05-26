import { z } from "zod";
import { ElementWithIdSchema } from "./ElementWithId";
import { FormContentCmsSchema } from "./FormContentCms";
import { HeadingSchema } from "./Heading";
import { LinkSchema } from "./Link";
import { ParagraphSchema } from "./Paragraph";
import { ResultPageTypeSchema } from "./ResultPageType";
import { HasTimestampsSchema } from "./HasTimestamps";

export const ResultPageSchema = HasTimestampsSchema.merge(
  z.object({
    slug: z.string(),
    meta: z
      .object({
        id: z.number(),
        title: z.string(),
      })
      .nullable(),
    pageType: ResultPageTypeSchema,
    heading: HeadingSchema,
    hintText: ParagraphSchema.nullable(),
    linkText: z.string().nullable(),
    reasonings: z.object({
      data: z
        .array(
          z.object({
            id: z.number(),
            attributes: ElementWithIdSchema,
          })
        )
        .nullable(),
    }),
    documents: z.object({
      data: z
        .object({
          id: z.number(),
          attributes: ElementWithIdSchema,
        })
        .nullable(),
    }),
    nextSteps: z.object({
      data: z
        .object({
          id: z.number(),
          attributes: ElementWithIdSchema,
        })
        .nullable(),
    }),
    freeZone: z.array(FormContentCmsSchema),
    nextLink: LinkSchema.nullable(),
  })
);

export type ResultPage = z.infer<typeof ResultPageSchema>;
