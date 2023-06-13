import { z } from "zod";
import { StrapiElementWithIdSchema } from "./StrapiElementWithId";
import { StrapiErrorCategorySchema } from "./StrapiErrorCategory";
import { StrapiFooterSchema } from "./StrapiFooter";
import { StrapiNavigationSchema } from "./StrapiNavigation";
import { StrapiPageSchema } from "./StrapiPage";
import { StrapiResultPageSchema } from "./StrapiResultPage";
import { StrapiVorabCheckCommonSchema } from "./StrapiVorabCheckCommon";
import { StrapiVorabCheckPageSchema } from "./StrapiVorabCheckPage";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiAmtsgerichtCommonSchema } from "./StrapiAmtsgerichtCommon";

export const StrapiFileContentSchema = z
  .object({
    "amtsgericht-common": z.array(
      HasStrapiIdSchema.extend({
        attributes: StrapiAmtsgerichtCommonSchema,
      })
    ),
    "element-with-ids": z.array(
      HasStrapiIdSchema.extend({
        attributes: StrapiElementWithIdSchema,
      })
    ),
    errors: z.array(
      HasStrapiIdSchema.extend({
        attributes: StrapiErrorCategorySchema,
      })
    ),
    footer: z.array(
      HasStrapiIdSchema.extend({
        attributes: StrapiFooterSchema,
      })
    ),
    navigation: z.array(
      HasStrapiIdSchema.extend({
        attributes: StrapiNavigationSchema,
      })
    ),
    pages: z.array(
      HasStrapiIdSchema.extend({
        attributes: StrapiPageSchema,
      })
    ),
    "result-pages": z.array(
      HasStrapiIdSchema.extend({
        attributes: StrapiResultPageSchema,
      })
    ),
    "vorab-check-common": z.array(
      HasStrapiIdSchema.extend({
        attributes: StrapiVorabCheckCommonSchema,
      })
    ),
    "vorab-check-pages": z.array(
      HasStrapiIdSchema.extend({
        attributes: StrapiVorabCheckPageSchema,
      })
    ),
  })
  .strict();

export type StrapiFileContent = z.infer<typeof StrapiFileContentSchema>;
