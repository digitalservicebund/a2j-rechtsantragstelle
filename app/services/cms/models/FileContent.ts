import { z } from "zod";
import { ElementWithIdSchema } from "./ElementWithId";
import { ErrorCategorySchema } from "./ErrorCategory";
import { FooterSchema } from "./Footer";
import { NavigationSchema } from "./Navigation";
import { PageSchema } from "./Page";
import { ResultPageSchema } from "./ResultPage";
import { VorabCheckCommonsSchema } from "./VorabCheckCommons";
import { VorabcheckPageSchema } from "./VorabcheckPage";

export const FileContentSchema = z.object({
  "element-with-ids": z.array(
    z.object({
      id: z.number(),
      attributes: ElementWithIdSchema,
    })
  ),
  errors: z.array(
    z.object({
      id: z.number(),
      attributes: ErrorCategorySchema,
    })
  ),
  footer: z.object({
    id: z.number(),
    attributes: FooterSchema,
  }),
  navigation: z.object({
    id: z.number(),
    attributes: NavigationSchema,
  }),
  pages: z.array(
    z.object({
      id: z.number(),
      attributes: PageSchema,
    })
  ),
  "result-pages": z.array(
    z.object({
      id: z.number(),
      attributes: ResultPageSchema,
    })
  ),
  "vorab-check-common": z.object({
    id: z.number(),
    attributes: VorabCheckCommonsSchema,
  }),
  "vorab-check-pages": z.array(
    z.object({
      id: z.number(),
      attributes: VorabcheckPageSchema,
    })
  ),
});

export type FileContent = z.infer<typeof FileContentSchema>;
