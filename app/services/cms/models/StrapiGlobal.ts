import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import type { FeedbackProps } from "~/components/FeedbackBanner";

export const StrapiGlobalSchema = z
  .object({
    feedbackHeading: z.string().nullable(),
    feedbackContent: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema);

type StrapiGlobal = z.infer<typeof StrapiGlobalSchema>;

export const getStrapiFeedback = (global: StrapiGlobal) => {
  return {
    heading: global.feedbackHeading ?? undefined,
    content: global.feedbackContent ?? undefined,
  } satisfies FeedbackProps;
};
