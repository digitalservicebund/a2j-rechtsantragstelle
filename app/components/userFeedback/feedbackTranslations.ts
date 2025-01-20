import { getTranslationByKey } from "~/services/translations/getTranslationByKey";
import { useTranslations } from "~/services/translations/translationsContext";

const feedbackTranslationsKeys = [
  "heading-feedback",
  "heading-personal-data-feedback",
  "placeholder-feedback",
  "submit-button-feedback",
] as const;
export type FeedbackTranslationKeys = (typeof feedbackTranslationsKeys)[number];

const postSubmissionTranslationKeys = [
  "heading-post-submission",
  "text-post-submission",
] as const;
export type PostSubmissionTranslationKeys =
  (typeof postSubmissionTranslationKeys)[number];

const ratingBoxTranslationsKeys = ["yes-rating", "no-rating"] as const;
export type RatingBoxTranslationKeys =
  (typeof ratingBoxTranslationsKeys)[number];

export function useFeedbackTranslations() {
  const { feedback: translations } = useTranslations();

  return Object.fromEntries(
    [
      ...feedbackTranslationsKeys,
      ...postSubmissionTranslationKeys,
      ...ratingBoxTranslationsKeys,
    ].map((key) => [key, getTranslationByKey(key, translations)]),
  ) as Record<
    | FeedbackTranslationKeys
    | PostSubmissionTranslationKeys
    | RatingBoxTranslationKeys,
    string
  >;
}
