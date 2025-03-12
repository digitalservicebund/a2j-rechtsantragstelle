import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "~/services/cms/models/HasStrapiId";

export const StrapiAccordionItemSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const StrapiAccordionSchema = z
  .object({
    items: z.array(StrapiAccordionItemSchema),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform((cmsData) => ({
    __component: "page.accordion" as const,
    ...cmsData,
  }));
