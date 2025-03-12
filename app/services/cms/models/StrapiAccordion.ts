import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiAccordionSchema = z
  .object({
    title: z.string(),
    description: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform((cmsData) => ({
    __component: "page.accordion" as const,
    ...cmsData,
  }));

export type StrapiAccordion = z.input<typeof StrapiAccordionSchema>;
