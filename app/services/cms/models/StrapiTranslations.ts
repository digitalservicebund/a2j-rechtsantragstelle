import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { StringWithHtmlEntities } from "./StringWithHtmlEntities";

export const StrapiTranslationSchema = z
  .object({
    scope: z.string(),
    field: z.array(
      z.object({ name: z.string(), value: StringWithHtmlEntities }),
    ),
  })
  .merge(HasStrapiLocaleSchema)
  .transform(({ scope, field }) => ({
    scope,
    entries: Object.fromEntries(field.map(({ name, value }) => [name, value])),
  }));
