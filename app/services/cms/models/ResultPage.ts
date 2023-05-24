import { z } from "zod";
import { ElementWithIdSchema } from "./ElementWithId";
import { FormContentCmsSchema } from "./FormContentCms";
import { HeadingSchema } from "./Heading";
import { LinkSchema } from "./Link";
import { ParagraphSchema } from "./Paragraph";
import { ResultPageTypeSchema } from "./ResultPageType";
import { TimestampableSchema } from "./Timestampable";

export const ResultPageSchema = TimestampableSchema.merge(
  z.object({
    slug: z.string(),
    meta: z.object({
      id: z.number(),
      title: z.string(),
    }),
    pageType: ResultPageTypeSchema,
    heading: HeadingSchema,
    hintText: ParagraphSchema.optional(),
    linkText: z.string().optional(),
    reasonings: z.object({
      data: z
        .array(
          z.object({
            id: z.number(),
            attributes: ElementWithIdSchema,
          })
        )
        .optional(),
    }),
    documents: z.object({
      data: z
        .object({
          id: z.number(),
          attributes: ElementWithIdSchema,
        })
        .optional(),
    }),
    nextSteps: z.object({
      data: z
        .object({
          id: z.number(),
          attributes: ElementWithIdSchema,
        })
        .optional(),
    }),
    freeZone: z.array(FormContentCmsSchema),
    nextLink: LinkSchema.optional(),
  })
);

export type ResultPage = z.infer<typeof ResultPageSchema>;
