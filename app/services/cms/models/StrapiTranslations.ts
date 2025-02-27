import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { stringWithHtmlEntities } from "./stringWithHtmlEntities";

export const StrapiTranslationSchema = z
  .object({
    scope: z.string(),
    field: z.array(
      z.object({ name: z.string(), value: stringWithHtmlEntities }),
    ),
  })
  .merge(HasStrapiLocaleSchema);
