import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";

export type FeedbackProps = {
  heading?: string;
  content?: string;
};

export type EnvironmentBannerProps = {
  content?: string;
};

export const StrapiGlobalSchema = z
  .object({
    feedbackHeading: z.string().nullish(),
    feedbackContent: z.string().nullish(),
    environmentBanner: z.string().nullish(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema);

type StrapiGlobal = z.infer<typeof StrapiGlobalSchema>;

export const getStrapiFeedback = (global: StrapiGlobal) => {
  return {
    heading:
      global.feedbackHeading === null ? undefined : global.feedbackHeading,
    content:
      global.feedbackContent === null ? undefined : global.feedbackContent,
  } satisfies FeedbackProps;
};

export const getStrapiEnvironmentBanner = (global: StrapiGlobal) => {
  return {
    content:
      global.environmentBanner === null ? undefined : global.environmentBanner,
  } satisfies EnvironmentBannerProps;
};
