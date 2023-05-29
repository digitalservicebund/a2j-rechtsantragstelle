import { z } from "zod";
import { StrapiElementWithIdSchema } from "./StrapiElementWithId";
import { StrapiErrorCategorySchema } from "./StrapiErrorCategory";
import { StrapiFooterSchema } from "./StrapiFooter";
import { StrapiNavigationSchema } from "./StrapiNavigation";
import { StrapiPageSchema } from "./StrapiPage";
import { StrapiResultPageSchema } from "./StrapiResultPage";
import { StrapiVorabCheckCommonsSchema } from "./StrapiVorabCheckCommons";
import { StrapiVorabCheckPageSchema } from "./StrapiVorabCheckPage";

export const StrapiFileContentSchema = z
  .object({
    "element-with-ids": z.array(
      z.object({
        id: z.number(),
        attributes: StrapiElementWithIdSchema,
      })
    ),
    errors: z.array(
      z.object({
        id: z.number(),
        attributes: StrapiErrorCategorySchema,
      })
    ),
    footer: z.array(
      z.object({
        id: z.number(),
        attributes: StrapiFooterSchema,
      })
    ),
    navigation: z.array(
      z.object({
        id: z.number(),
        attributes: StrapiNavigationSchema,
      })
    ),
    pages: z.array(
      z.object({
        id: z.number(),
        attributes: StrapiPageSchema,
      })
    ),
    "result-pages": z.array(
      z.object({
        id: z.number(),
        attributes: StrapiResultPageSchema,
      })
    ),
    "vorab-check-common": z.array(
      z.object({
        id: z.number(),
        attributes: StrapiVorabCheckCommonsSchema,
      })
    ),
    "vorab-check-pages": z.array(
      z.object({
        id: z.number(),
        attributes: StrapiVorabCheckPageSchema,
      })
    ),
  })
  .strict();

export type StrapiFileContent = z.infer<typeof StrapiFileContentSchema>;
